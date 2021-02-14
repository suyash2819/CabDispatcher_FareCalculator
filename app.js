const driverDetails = [
  { Name: "DriverAA", Rating: 4.3, Rides: 10 },
  { Name: "DriverBB", Rating: "N/A", Rides: 0 },
  { Name: "DriverCC", Rating: 4.83, Rides: 15 },
  { Name: "DriverDD", Rating: 4.8, Rides: 4 },
  { Name: "DriverEE", Rating: 4.5, Rides: 2 },
];

const baseFare = 50; //in rs

const readline = require("readline");

const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//to find random index to assign random driver aif more than one present
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//find the driver according to the type of customer
const findDriver = (ratingRange) => {
  let driverFound = false;
  while (driverFound == false) {
    let index = getRandomInt(0, 4);
    if (driverDetails[index].Rides > 5 && driverDetails[index].Rating < 4) {
      continue;
    } else {
      if (driverDetails[index].Rides < 5) {
        console.log({ ...driverDetails[index], Rating: 5 });
        driverFound = true;
      } else if (driverDetails[index].Rating >= ratingRange) {
        console.log(driverDetails[index]);
        driverFound = true;
      }
    }
  }
};

//ask question regarding the customer type, then fare calculation
r1.question("Enter Customer Type ? ", function (type) {
  if (type.toUpperCase() === "Silver".toUpperCase()) {
    findDriver(1);
  } else if (type.toUpperCase() === "Gold".toUpperCase()) {
    findDriver(4.5);
  } else if (type.toUpperCase() === "Platinum".toUpperCase()) {
    findDriver(4.8);
  } else {
    console.log("enter valid customer type (silver, gold or platinum)");
  }
  fareCalculation();
});

//check for valid inputs from user
const checkUserInput = (
  distancetravelled,
  traveltime,
  waitingtime,
  cancelledbeforestarting,
  cancelledafterstarting
) => {
  let values = ["T", "F"];
  let errorCount = 0;
  if (
    isNaN(traveltime) ||
    isNaN(waitingtime) ||
    isNaN(distancetravelled) ||
    traveltime < 0 ||
    waitingtime < 0 ||
    distancetravelled < 0
  ) {
    console.log("Enter valid time or distance");
    errorCount++;
    r1.close();
  }
  if (
    !values.includes(cancelledafterstarting.toUpperCase()) ||
    !values.includes(cancelledbeforestarting.toUpperCase())
  ) {
    console.log("Enter either T(True) or F(False) for cancellation question");
    errorCount++;
    r1.close();
  }

  if (
    cancelledafterstarting.toUpperCase() === "T".toUpperCase() &&
    cancelledbeforestarting.toUpperCase() === "T".toUpperCase()
  ) {
    console.log(
      "please enter either after cancellation or before cancellation"
    );
    errorCount++;
    r1.close();
  }
  return errorCount;
};

//ask questions regarding fare calculation and then ask to give rating to the driver
const fareCalculation = () => {
  r1.question(
    "please enter the distance travelled (kms)",
    (distancetravelled) => {
      r1.question("please enter the time of travel (mins)", (traveltime) => {
        r1.question("please enter the waiting time (mins)", (waitingtime) => {
          r1.question(
            "was the ride cancelled after starting of the trip ? (T/F)",
            (cancelledafterstarting) => {
              r1.question(
                "was the ride cancelled before starting of the trip ? (T/F)",
                (cancelledbeforestarting) => {
                  let errorCheck = checkUserInput(
                    distancetravelled,
                    traveltime,
                    waitingtime,
                    cancelledbeforestarting,
                    cancelledafterstarting
                  );
                  // if we have invalid input it will not got to calculate and print total fare
                  if (errorCheck > 0) {
                    r1.close();
                  } else {
                    //if trip is cancelled before starting with waiting time restriction , the fare will be 0
                    if (
                      cancelledbeforestarting.toUpperCase() ===
                        "T".toUpperCase() &&
                      waitingtime <= 4
                    ) {
                      console.log("Total Fare is: 0");
                      r1.close();
                    }
                    //else calculating the fare based on time travel, currently distance is not used in calculating fare
                    else {
                      waitingtime = Math.floor(waitingtime);
                      let waitingFare = 0;
                      let cancellationFare = 0;
                      if (waitingtime > 4) {
                        waitingFare = (waitingtime - 4) * 10;
                      }
                      if (
                        cancelledbeforestarting.toUpperCase() ===
                          "T".toUpperCase() &&
                        waitingtime > 4
                      ) {
                        cancellationFare = 50;
                        waitingFare = 0;
                        traveltime = 0;
                      }
                      // if cancelled after starting, the fare is taken by taking time of travel and cancellation fee if waiting time > 4 mins
                      if (
                        cancelledafterstarting.toUpperCase() ===
                          "T".toUpperCase() &&
                        waitingtime > 4
                      ) {
                        cancellationFare = 50;
                      }
                      let totalFare =
                        traveltime * 1 + waitingFare + cancellationFare; //travel time rate is rs 1/min
                      if (totalFare > baseFare)
                        console.log("Total Fare is: ", totalFare);
                      else console.log("Total Fare is: ", baseFare);
                      giveRating();
                    }
                  }
                }
              );
            }
          );
        });
      });
    }
  );
};

const giveRating = () => {
  r1.question("please give rating for the driver", (driverRating) => {
    if (driverRating > 5 || driverRating < 1)
      console.log("please give rating between 1 to 5 inclusive");
    console.log("Thank You");
    r1.close();
  });
};
