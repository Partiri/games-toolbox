const puppeteer = require("puppeteer");
const fs = require("fs");

// const user_profile_url = 'https://cod.tracker.gg/warzone/profile/atvi/DrDisrespect%239218550/overview'
const players = [
  {
    id: 239218550,
    name: "DrDisrespect",
  },
];

const matches = [
  "https://cod.tracker.gg/warzone/match/9769876611509369234",
  "https://cod.tracker.gg/warzone/match/8085134839888668337",
  "https://cod.tracker.gg/warzone/match/9199614612272297928",
  "https://cod.tracker.gg/warzone/match/14717882476597333783",
  "https://cod.tracker.gg/warzone/match/4327162027784086987",
  "https://cod.tracker.gg/warzone/match/10396487462604531071",
  "https://cod.tracker.gg/warzone/match/7788051320344948151",
  "https://cod.tracker.gg/warzone/match/15542366359268997057",
  "https://cod.tracker.gg/warzone/match/16016459056749526896",
  "https://cod.tracker.gg/warzone/match/15400976820254894132",
  "https://cod.tracker.gg/warzone/match/11399619463622855219",
  "https://cod.tracker.gg/warzone/match/446919679637255183",
  "https://cod.tracker.gg/warzone/match/3525093268738443003",
  "https://cod.tracker.gg/warzone/match/12698137844746084805",
  "https://cod.tracker.gg/warzone/match/11179900957597616625",
  "https://cod.tracker.gg/warzone/match/3832856229027161831",
  "https://cod.tracker.gg/warzone/match/1778440104675660347",
  "https://cod.tracker.gg/warzone/match/4776240010996310745",
  "https://cod.tracker.gg/warzone/match/8791365342907227482",
  "https://cod.tracker.gg/warzone/match/7560366098295719562",
];

const links = [
  "https://cod.tracker.gg/warzone/match/9769876611509369234?handle=DrDisrespect",
  "https://cod.tracker.gg/warzone/match/8085134839888668337?handle=DrDisrespect",
  "https://cod.tracker.gg/warzone/match/9199614612272297928?handle=DrDisrespect",
  "https://cod.tracker.gg/warzone/match/14717882476597333783?handle=DrDisrespect",
  "https://cod.tracker.gg/warzone/match/4327162027784086987?handle=DrDisrespect",
  "https://cod.tracker.gg/warzone/match/10396487462604531071?handle=DrDisrespect",
  "https://cod.tracker.gg/warzone/match/7788051320344948151?handle=DrDisrespect",
  "https://cod.tracker.gg/warzone/match/15542366359268997057?handle=DrDisrespect",
  "https://cod.tracker.gg/warzone/match/16016459056749526896?handle=DrDisrespect",
  "https://cod.tracker.gg/warzone/match/15400976820254894132?handle=DrDisrespect",
  "https://cod.tracker.gg/warzone/match/11399619463622855219?handle=DrDisrespect",
  "https://cod.tracker.gg/warzone/match/446919679637255183?handle=DrDisrespect",
  "https://cod.tracker.gg/warzone/match/3525093268738443003?handle=DrDisrespect",
  "https://cod.tracker.gg/warzone/match/12698137844746084805?handle=DrDisrespect",
  "https://cod.tracker.gg/warzone/match/11179900957597616625?handle=DrDisrespect",
  "https://cod.tracker.gg/warzone/match/3832856229027161831?handle=DrDisrespect",
  "https://cod.tracker.gg/warzone/match/1778440104675660347?handle=DrDisrespect",
  "https://cod.tracker.gg/warzone/match/4776240010996310745?handle=DrDisrespect",
  "https://cod.tracker.gg/warzone/match/8791365342907227482?handle=DrDisrespect",
  "https://cod.tracker.gg/warzone/match/7560366098295719562?handle=DrDisrespect",
];

async function getMatches(player) {
  const user_profile_matches_url =
    `https://cod.tracker.gg/warzone/profile/atvi/${player.name}%${player.id}/matches`;
  console.log(user_profile_matches_url);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();

  await page.goto(user_profile_matches_url);

  await page.setViewport({ width: 1675, height: 861 });

  await page.waitForSelector(".match-row__link");

  //   await page.screenshot({ path: 'example2.png' });
  const matches = await page.evaluate(() => {
    return {
      links: Array.from(document.getElementsByClassName("match-row__link")).map(
        (link) => link.href,
      ),
    };
  });

  await browser.close();

  return matches;
}

async function getUsersPerMatch(match_id) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();

  await page.goto(match_id);

  await page.setViewport({ width: 1675, height: 861 });

  await page.waitForSelector(".trn-ign__username");

  // await page.waitForSelector('#onetrust-accept-btn-handler')
  // await page.click('#onetrust-accept-btn-handler')

  // await page.screenshot({ path: 'example3.png' });

  const list_of_users = await page.evaluate(() => {
    return {
      list_of_users: Array.from(
        document.getElementsByClassName("trn-ign__username"),
      ).map((user) => user.innerText),
    };
  });

  console.log("match " + match_id + "users:", list_of_users);

  await browser.close();

  return list_of_users;
}

async function getUsersFromFile(file_path) {
    const json_file = await fs.readFileSync(file_path, "utf8");
    return json_file
    //   return json_file.list_of_users;
}

(async () => {
  console.log("ASYNC");
  const users = [];


  for (let i = 0; i < 10; i++) {
      console.log('LOOP:',i);
    //check if the file with matches[i] exists in the folder cod-sniper-results with the extension JSON
    const file_name = matches[i].split("/")[5].split("?")[0] + ".json";
    const file_path = "cod-sniper-results/" + file_name;

    let users_in_match = [];

    if (fs.existsSync(file_path)) {
      //open json file and add the content of the array users_per_match to the json file
      users_in_match = await getUsersFromFile(file_path);
      console.log(users_in_match);

    //   console.log("users:", users);
    } else {
      users_in_match = await getUsersPerMatch(matches[i]);
      const match_id = links[i].match(/\d+/g);

      console.log("Saving match :" + match_id);
      fs.writeFileSync(
        "./cod-sniper-results/" + match_id + ".json",
        JSON.stringify(users_in_match),
      );

    }

    //for of loop threw the users_per_match array and add the users to the users array with the count of repeating users
    for (let user of users_in_match) {
        if (users.includes(user)) {
            users[users.indexOf(user)]++;
        } else {
            users.push(user);
        }
    }
  }

  //remove all users who appear only once
  console.log('Sorting users');
  for (let i = 0; i < users.length; i++) {
    if (users[i].appearances === 1) {
      users.splice(i, 1);
    }
  }

  //order users by appearances
  users.sort((a, b) => (a.appearances > b.appearances) ? -1 : 1);

  //save users to file called users.json
  fs.writeFile(
    "./cod-sniper-results/users.json",
    JSON.stringify(users),
    function (err) {
      if (err) throw err;
      console.log("Saved!");
    },
  );
})();
