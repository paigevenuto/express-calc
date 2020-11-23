const express = require("express");
const PORT = 3000;
const app = express();
const ExpressError = require("./expressError");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function numsChecker(nums) {
  let checkedNums = nums;
  if (checkedNums == "") throw new ExpressError("nums are required", 400);
  try {
    checkedNums = checkedNums.split(",");
  } catch {
    throw new ExpressError("Invalid parameters", 400);
  }
  checkedNums = checkedNums.sort().map(function (x) {
    let num = x * 1;
    if (x == "") throw new ExpressError("no numbers can be empty", 400);
    if (isNaN(num)) {
      throw new ExpressError(`${x} is not a number!`, 400);
    }
    return num;
  });
  return checkedNums;
}

app.get("/mean", function (request, response, next) {
  try {
    let nums = numsChecker(request.query.nums);
    let result = {
      result: {
        operation: "mean",
        value: nums.reduce((acc, c) => acc + c, 0) / nums.length,
      },
    };
    return response.send(result);
  } catch (err) {
    return next(err);
  }
});

app.get("/median", function (request, response, next) {
  try {
    let nums = numsChecker(request.query.nums);
    let median;
    if (nums.length % 2 == 0) {
      let first = Math.floor(nums.length / 2) - 1;
      let second = Math.floor(nums.length / 2);
      median = (nums[first] + nums[second]) / 2;
    } else {
      median = nums[Math.floor(nums.length / 2)];
    }
    let result = {
      result: {
        operation: "median",
        value: median,
      },
    };
    return response.json(result);
  } catch (err) {
    return next(err);
  }
});

const mode = (nums) => {
  return mode;
};

app.get("/mode", function (request, response, next) {
  try {
    let nums = numsChecker(request.query.nums);
    let map = new Map();
    let maxCount = 0;
    let mode;
    for (let num of nums) {
      let count;
      if (map.has(num)) {
        count = map.get(num);
      } else {
        count = 0;
      }
      count++;

      if (count > maxCount) {
        maxCount = count;
        mode = num;
      }

      map.set(num, count);
    }
    let result = {
      result: {
        operation: "mode",
        value: mode,
      },
    };
    return response.json(result);
  } catch (err) {
    return next(err);
  }
});

// 404 handler
app.use(function (req, res, next) {
  const notFoundError = new ExpressError("Not Found", 404);
  return next(notFoundError);
});

// generic error handler
app.use(function (err, req, res, next) {
  // the default status is 500 Internal Server Error
  let status = err.status || 500;
  let message = err.message;

  // set the status and alert the user
  return res.status(status).json({
    error: { message, status },
  });
});
// end generic handler

app.listen(PORT, function () {
  console.log("App on port " + PORT.toString());
});
