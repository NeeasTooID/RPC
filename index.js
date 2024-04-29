const Discord = require('discord.js-selfbot-v13');
const os = require('os');
const osUtils = require('os-utils');
const config = require('./config.json');

const client = new Discord.Client();

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  let startTime = Date.now();

  // Update presence every 5 seconds with system stats
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const ramUsage = getRamUsage();
    const { downloadSpeed, uploadSpeed } = getRandomInternetSpeed();
    const uptime = calculateUptime(startTime);

    const presenceDetails = `CPU: ${cpuUsage.toFixed(2)}% RAM: ${ramUsage.toFixed(2)}% | Uptime: ${uptime}`;
    const presenceState = `Download: ${downloadSpeed.toFixed(2)} MB/s | Upload: ${uploadSpeed.toFixed(2)} MB/s`;

    const r = new Discord.RichPresence()
      .setApplicationId(config.applicationId)
      .setType('PLAYING')
      .setName(config.rpc.name)
      .setDetails(presenceDetails)
      .setState(presenceState)
      .setAssetsLargeImage(config.rpc.largeImage)
      .setAssetsLargeText(config.rpc.largeImageText)
      .setAssetsSmallImage(config.rpc.smallImage)
      .setAssetsSmallText(config.rpc.smallImageText);

    if (config.button && config.button.label && config.button.url) {
      r.addButton(config.button.label, config.button.url);
    }

    client.user.setActivity(r);
  }, 5000); // Update every 5 seconds
});

client.login(config.token);

// Function to get CPU usage percentage
async function getCpuUsage() {
  return new Promise((resolve, reject) => {
    osUtils.cpuUsage((cpuUsage) => {
      resolve(cpuUsage * 100);
    });
  });
}

// Function to get RAM usage percentage
function getRamUsage() {
  return osUtils.freememPercentage() * 100;
}

// Function to get random internet speed
function getRandomInternetSpeed() {
  const downloadSpeed = getRandomNumber(1, 100);
  const uploadSpeed = getRandomNumber(1, 100);
  return { downloadSpeed, uploadSpeed };
}

// Helper function to get random number in a range
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// Function to calculate uptime
function calculateUptime(startTime) {
  const uptimeMillis = Date.now() - startTime;
  const days = Math.floor(uptimeMillis / (1000 * 60 * 60 * 24));
  const hours = Math.floor((uptimeMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((uptimeMillis % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((uptimeMillis % (1000 * 60)) / 1000);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
