(function () {
  "use strict";
  // Needed to remove linting problems with "$" in jQuery
  /* globals jQuery, $, waitForKeyElements */

  //***************** OPTIONS ****************************

  let __ColorBackground = true; // Set 'false' (no quotes) to prevent coloring of background.
  let __TabRename = true; // Set 'false' (no quotes) to prevent global renaming of Tabs / Click the checkbox right of game search bar.
  let __Season = "Winter"; // Set to ["Winter"] [(B/G); [" ", undefined] for Fall.
  let __TabNameFormat = "closed"; // BRACKETS OR SPACES ( closed => '(B) WA' ) or ( open => 'B WA' )
  let __TabNameLength = "short";

  //***************** END OPTIONS ************************

  console.log("Custom Styling Script Started");

  // Set colors for background and game rows.
  const girlColors = { topRow: "#e8c5d7ee", bottomRows: "#efe8ebaa" };
  const boyColors = { topRow: "#477aa144", bottomRows: "#eff4f7" };
  const neutralColors = {
    topRow: "rgb(188 231 213 / 75%)",
    bottomRows: "rgb(188 231 213 / 75%)",
  };

  // Attach the event handler to refresh and color the "controls"
  $("button#refreshSearch").click((evt) => {
    let color = getColor().topRow;
    let renameBox = $("#checkname");
    if (!$(renameBox).prop("checked")) {
      setTabName();
    }
    // Set the color of the main control bar background
    $("#gameManager > div:nth-child(3)").css("background-color", color);
    if (__ColorBackground) {
      // Prevents setting the background color of control bar if false, not set.
      $("body").css("background-color", color);
    }
  });

  // Extra Handler for td Game Row Colors via clicking 'CONTROLS' H4 Header.
  $("#gameManager > div:nth-child(3) > h4").click(function () {
    console.log("Event Handler for Controls H4 activated");
    $("div#searchResults tr.gameRow td").css(
      "background-color",
      getColor().bottomRows
    );
  });

  // setTabName() -> Sets the tab name after being processed by setupForTabName
  function setTabName() {
    let tabName = setupForTabName();
    // Rename the Tab to 'tabName' variable
    setTimeout(function () {
      document.title = tabName;
      console.log("Renamed tab to: " + tabName);
    }, 600);
  }

  // convertStateToAbbr (statewithnospaces) -> Returns Abbreviation
  function convertStateToAbbr(input) {
    // Takes in state, normalized with no spaces, commas
    const _MapFullNameAbbr = {
      arizona: "AZ",
      alabama: "AL",
      alaska: "AK",
      arkansas: "AR",
      california: "CA",
      colorado: "CO",
      connecticut: "CT",
      districtofcolumbia: "DC",
      delaware: "DE",
      florida: "FL",
      georgia: "GA",
      idaho: "ID",
      illinois: "IL",
      indiana: "IN",
      iowa: "IA",
      kansas: "KS",
      kentucky: "KY",
      louisiana: "LA",
      maine: "ME",
      maryland: "MD",
      massachusetts: "MA",
      michigan: "MI",
      minnesota: "MN",
      mississippi: "MS",
      missouri: "MO",
      montana: "MT",
      nebraska: "NE",
      nevada: "NV",
      newhampshire: "NH",
      newjersey: "NJ",
      newmexico: "NM",
      newyork: "NY",
      northcarolina: "NC",
      northdakota: "ND",
      ohio: "OH",
      oklahoma: "OK",
      oregon: "OR",
      pennsylvania: "PA",
      rhodeisland: "RI",
      southcarolina: "SC",
      southdakota: "SD",
      tennessee: "TN",
      texas: "TX",
      utah: "UT",
      vermont: "VT",
      virginia: "VA",
      washington: "WA",
      westvirginia: "WV",
      wisconsin: "WI",
      wyoming: "WY",
    };
    if (input === undefined) {
      console.error("State Input was undefined");
      return input;
    }
    let strInput = input.trim();
    // Remove Spaces, not needed as already done in getState function
    let strStateToFind = strInput.toLowerCase().replace(/\ /g, "");
    let foundAbbr = _MapFullNameAbbr[strStateToFind];
    return foundAbbr;
  }

  function getGender() {
    // Returns "Boys" "Girls" or "Both"
    let genderStr = $("li.select2-search-choice").text();
    let match = genderStr.match(/((Boy)|(Girl))s/g);
    if (match.length === 2) {
      return "Both";
    }
    if (match[0] === "Boys") {
      return "Boys";
    }
    if (match[0] === "Girls") {
      return "Girls";
    }
  }

  // GetColor() -> Returns the color object using the getGender function
  function getColor() {
    let color;
    switch (getGender()) {
      case "Boys":
        color = boyColors;
        break;
      case "Girls":
        color = girlColors;
        break;
      default:
        color = neutralColors;
    }
    return color;
  }

  // createRenameCheckBox() -> no return, just creates the small checkbox next to team search textbar.
  // Used to prevent renaming a tab always if the current name is correct.
  function createRenameCheckBox() {
    var box = document.createElement("input");
    box.setAttribute("type", "checkbox");
    box.setAttribute("id", "checkname");
    box.setAttribute("name", "checkname");
    box.style.marginLeft = "12px";
    $("span#clearQuickFind").append(box);
  }

  // If __TabRename option is set (default) and createRenameCheckBox box does not Exist, create it.
  if (__TabRename && !document.getElementById("checkname")) {
    createRenameCheckBox();
  }

  // Main logic function to build the tab name
  function setupForTabName() {
    // Returns the string for use in setTabName
    let tabName;

    // Get the Selected Gender
    // Didn't use IIFE here because getGender is called outside for colors.  Maybe refactor?
    let gender = getGender();

    // Get the Gender Abbreviation of "B", "G", "BG"
    let genderAbbrv = gender === "Both" ? "BG" : gender === "Boys" ? "B" : "G";

    // Get the Sport
    let sport = (function getSport() {
      let select = document.querySelector("#sportFilter");
      let sport = select.options[select.options.selectedIndex].textContent;
      return sport;
    })();

    // Get the State
    let state = (function getState() {
      let state = document.querySelector("#stateToSearch"); // Grab the options element
      let stateText = state.options[state.selectedIndex].textContent; // Get the text of current selected element
      let cleanedState = stateText.toLowerCase().replace(/(\ |,)/g, ""); // Remove Spaces and Commas
      return cleanedState; // Returns clean,normalized state for use in convertStateToAbbr function.
    })();

    // Get State Abbreviation
    let stateAbbr = convertStateToAbbr(state);

    // TAB FORMAT :: "Closed" Format = (B);  "Open" = B
    gender =
      __TabNameFormat === "closed" ? "(" + genderAbbrv + ")" : genderAbbrv;

    // Winter Sports; Hockey is the odd named sport
    if (__Season === "Winter") {
      if (sport === "Hockey") {
        // Only Minnesota has Hockey
        tabName = `${gender}-HK`;
      } else {
        // Basketball
        tabName = `${gender} ${stateAbbr}`;
      }

      // Fall Sports;
    } else {
      // Volleyball, Implicitly Girls
      if (sport == "Volleyball") {
        tabName = `${stateAbbr}-VB`;
      } else if (__TabNameLength == "short") {
        tabName = stateAbbr;
      }
    }

    let finalValues = { sport, state, stateAbbr, gender, tabName };
    console.warn("Final Values");
    console.table(finalValues);
    return tabName;
  }
  // END OF setupForTabName function
})();
