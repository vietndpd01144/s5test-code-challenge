var sum_to_n_a = function (n: number) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

var sum_to_n_b = function (n: number) {
  if (n <= 0) return 0;
  return n % 2 === 0 ? (n / 2) * (n + 1) : n * ((n + 1) / 2);
};

var sum_to_n_c = function (n: number) {
  if (n <= 0) return 0;
  const N = BigInt(n);
  const res = (N * (N + 1n)) / 2n;
  const MAX = BigInt(Number.MAX_SAFE_INTEGER);
  if (res > MAX) {
    throw new RangeError("Result exceeds Number.MAX_SAFE_INTEGER");
  }
  return Number(res);
};

console.log(sum_to_n_a(5));
console.log(sum_to_n_b(5));
console.log(sum_to_n_c(5));
