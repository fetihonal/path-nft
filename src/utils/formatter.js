import BigNumber from "bignumber.js";

export function roundNumber(num, roundNum = 4) {
  BigNumber.set({ DECIMAL_PLACES: roundNum, ROUNDING_MODE: 1 });
  var decVal = new BigNumber(num);
  return decVal.toFixed(roundNum);
}

export function roundNumberOne(num, roundNum = 4) {
  var decVal = new BigNumber(num);
  return decVal.toFixed(roundNum);
}

export function mergeAmount(num, symbol) {
  // var finalNum = roundNumber(num)
  // return finalNum + ' ' + symbol
  return num + " " + symbol;
}

export function isGreaterThanOrEqualTo(one, two) {
  var numOne = BigNumber(one);
  return numOne.isGreaterThanOrEqualTo(BigNumber(two));
}

export function numToString(num) {
  var numOne = BigNumber(num);
  return numOne.toString();
}

export function percentageOf(ofPercent, inNum, roundNum = 4) {
  var numOne = BigNumber(inNum);
  // return numOne.multipliedBy(ofPercent).dividedBy(100).toFixed(roundNum)
  // return numOne.multipliedBy(ofPercent).dividedBy(100)
  return numOne.multipliedBy(BigNumber(ofPercent)) / 100;
}

export function multipliedBy(one, two, roundNum = 4) {
  var numOne = BigNumber(one);
  // return numOne.multipliedBy(two).toFixed(roundNum)
  return numOne.multipliedBy(two);
}

export function plusNum(one, two, roundNum = 4) {
  var numOne = BigNumber(one);
  // return numOne.plus(two).toFixed(roundNum)
  return numOne.plus(two);
}
export function minusNum(one, two) {
  var numOne = BigNumber(one);
  return numOne.minus(two);
}

export function isEqualTo(one, two) {
  return BigNumber(one).isEqualTo(BigNumber(two));
}
export function isLessThanOrEqualTo(one, two) {
  return BigNumber(one).isLessThanOrEqualTo(BigNumber(two));
}

// CHECK FOR NON NEGATIVE AND GREATER THAN ZERO
export function validNum(num) {
  var numOne = BigNumber(num);
  return numOne.isInteger(num) && numOne.isGreaterThan(0);
}

export function validFloat(num) {
  var numOne = BigNumber(num);
  return numOne.isPositive() && numOne.isGreaterThan(0);
}

export function toNum(num) {
  return BigNumber(num).toNumber();
}

export function mulBy(one, two) {
  return BigNumber(one).multipliedBy(two);
}

export function divBy(one, two) {
  return BigNumber(one).dividedBy(two);
}
export function splitSign(sign, web3) {
  sign = sign.slice(2);
  var r = `0x${sign.slice(0, 64)}`;
  var s = `0x${sign.slice(64, 128)}`;
  var v = web3.utils.toDecimal(`0x${sign.slice(128, 130)}`);
  return [v, r, s];
}

export function chainIdToExplore(chainId) {
  return {
    43114: "0xa86a",
    43113: "0xa869",
    1: "0x1",
    137: "https://polygonscan.com/address/",
    56: "https://bscscan.com/address/",
    97: "https://testnet.bscscan.com/address/",
    80001: "https://mumbai.polygonscan.com/address/",
  }[chainId];
}
export function chainIdToSymbol(chainId) {
  return {
    43114: "AVAX",
    43113: "AVAX",
    1: "ETH",
    137: "MATIC",
    56: "MATIC",
    97: "BSC",
    80001: "BSC",
  }[chainId];
}

export function chainIdToNetwork(chainId) {
  return {
    "0xa86a": "Avalanche",
    "0xa869": "Avalanche Fuji",
    "0x1": "Ethereum",
    "0x89": "Polygon",
    "0x13881": "Matic Mumbai",
    "0x38": "Binance",
    "0x61": "Binance Testnet",
  }[chainId];
}

export function numberToHex(id) {
  return {
    43114: "0xa86a",
    43113: "0xa869",
    1: "0x1",
    137: "0x89",
    56: "0x38",
    97: "0x61",
    80001: "0x13881",
  }[id];
}

export default {
  multipliedBy,
  percentageOf,
  plusNum,
  isGreaterThanOrEqualTo,
  isLessThanOrEqualTo,
  roundNumber,
  mulBy,
  numToString,
  divBy,
  toNum,
  percentageOf,
  splitSign,
  chainIdToNetwork,
  numberToHex,
  chainIdToExplore,
  chainIdToSymbol,
};
