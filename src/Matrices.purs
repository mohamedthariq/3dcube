module Matrices where

import Prelude

import Data.Array (index, length, updateAt, zipWith)
import Data.Foldable
import Data.Int
import Data.Maybe
import Data.Number (fromString)
import Data.String
import LinearAlgebra.Matrix
import LinearAlgebra.Matrix (multiply) as N
import Math

newtype RotationVector = RotationVector (Matrix Number)
newtype TransformMatrix = TransformMatrix (Matrix Number)
rotationVector a
  | length a == 4 = RotationVector (fromMaybe (identity 1) (fromArray 4 1 a))
  | otherwise = noRotation
noRotation = RotationVector (fromMaybe (identity 1)
  (fromArray 4 1 [0.001, 0.001, 0.001, 0.001]))

transformMatrix a
  | length a == 16 = TransformMatrix (fromMaybe (identity 1) (fromArray 4 4 a))
  | otherwise = noTransformation
noTransformation = TransformMatrix (fromMaybe (identity 1)
  (fromArray 4 4 [0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]))

class MatrixToString a where
  toString :: a -> String
instance transformMatrixToString :: MatrixToString TransformMatrix where
  toString (TransformMatrix mt) =
    "(" <>
    (fromMaybe "" $ stripPrefix (Pattern ", ") $
      foldl (\s vec -> s <> foldl (\s' n -> s' <> ", " <> show n) "" vec) "" (rows mt))
    <> ")"

instance rotationVectorToString :: MatrixToString RotationVector where
  toString (RotationVector v) =
    "("
    <> (fromMaybe "" $ stripPrefix (Pattern ", ") $
          foldl (\s vec -> s <> foldl (\s' n -> s' <> ", " <> show n) "" vec) "" (rows v))
    <> "deg)"

toTransformMatrix str
  | contains (Pattern "matrix3d(") str = do
      let a = foldl (\ar s -> ar <> [fromMaybe 0.0 (fromString s)]) [] $
            split (Pattern ", ") $
            fromMaybe "" (stripSuffix (Pattern ")") $
            fromMaybe "" (stripPrefix (Pattern "matrix3d(") str))
      if length a /= 16
        then
          noTransformation
        else
          transformMatrix a
  | otherwise = noTransformation

multiply (TransformMatrix mt) (RotationVector v) = RotationVector (N.multiply mt v)
angle (RotationVector m) = fromMaybe 0.0 $ element 3 0 m

sum vs = foldl (\acc v -> add acc v) noRotation vs
  where
    add :: RotationVector -> RotationVector -> RotationVector
    add (RotationVector m1) (RotationVector m2) = do
      let a = zipWith (+) (column 0 m1) (column 0 m2)
      let x = fromMaybe 0.0 (index a 0)
      let y = fromMaybe 0.0 (index a 1)
      rotationVector $ fromMaybe [] (updateAt 3 (sqrt $ x * x + y * y) a)

diff vs = do
  let (RotationVector sum) = sum vs
  let s = (fromMaybe 0.0 (element 3 0 sum)) / toNumber (length vs)
  sc s (RotationVector sum)
sc s (RotationVector v) = do
  let x = fromMaybe 0.0 (element 0 0 v)
  let y = fromMaybe 0.0 (element 1 0 v)
  let a = if y == 0.0 then 0.0 else if x == 0.0 then pi / 2.0 else atan (abs(y / x))
  rotationVector [
    (s * cos a) * (if x < 0.0 then -1.0 else 1.0),
    (s * sin a) * (if y < 0.0 then -1.0 else 1.0),
    0.0,
    s
  ]
