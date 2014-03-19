// forM :: [a] -> (a -> Cont r b) -> Cont r [b]
exports.forM = function(arr, fn, k) {
  res = new Array();
  (function rec(i) {
    if (i < arr.length) {
      fn(arr[i], function(data) {
        res.push(data);
        rec(i+1);
      });
    } else {
      k(res);
    }
  })(0);
}
