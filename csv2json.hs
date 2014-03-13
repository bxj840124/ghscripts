import Data.List (intercalate, )

type Fields = String

convertLine :: [Fields] -> String -> [(Fields, String)]
convertLine fields = zip fields . splitWhen (== ',')

-- repeatly break
splitWhen :: (a -> Bool) -> [a] -> [[a]]
splitWhen p []     = [[]]
splitWhen p (x:xs)
  | p x            = []:splitWhen p xs
splitWhen p (x:xs) = (x:hd):tl
  where hd:tl = splitWhen p xs

trim :: String -> String
trim = dropSpaces . reverse . dropSpaces . reverse
  where dropSpaces = dropWhile (== ' ') . dropWhile (== '\t') . dropWhile (== '\n')

showKeyValue (a, b) = "\"" ++ a ++ "\": \"" ++ b ++ "\""

main :: IO ()
main = interact $ \input ->
  let ls = lines input
      fields = map trim . splitWhen (== ',') $ head ls
  in "[\n" ++ (intercalate ",\n" $
               fmap (("  {\n" ++ ) . (++ "\n  }")
                     . intercalate ",\n"
                     . fmap ("    " ++) . fmap showKeyValue
                     . convertLine fields) (tail ls))
           ++ "\n]\n"
