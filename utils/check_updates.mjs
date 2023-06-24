import fetch from 'node-fetch';
import fs from 'fs';
import { DOMParser } from '@xmldom/xmldom';

// URL list to fetch
const urls = ['https://developer.nvidia.com/cuda-toolkit-archive', 'https://docs.nvidia.com/cuda/archive/'];

// Regex pattern to match
const pattern = /^https:\/\/docs.nvidia.com\/cuda\/archive\/(.+?)\//;

// Fetch and extract versions from the URLs
const fetchAndExtractVersions = async (url) => {
  console.log(`Parsing: ${url}`);
  const response = await fetch(url);
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");
  const links = Array.from(doc.getElementsByTagName('a'));
  const versionsFound = links.map(link => new URL(link.getAttribute('href'), url).href)
                        .filter(href => pattern.test(href))
                        .map(href => pattern.exec(href)[1]);
  const versions = versionsFound.filter((href, idx) => {
    return versionsFound.indexOf(href) === idx;  // Dedup
  });
  // versions.unshift('21.2.3');
  console.log(`Found: ${versions.join(", ")}`);
  return versions;
}

// Read version.json file
const readVersionsFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading file:', err);
    return [];
  }
}

// Write version.json file
const writeVersionsFile = (versions, filePath) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(versions, null, 2) + '\n', 'utf8');
  } catch (err) {
    console.error('Error writing file:', err);
  }
}

// Main function
const main = async () => {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Please provide the path to the version.json file as an argument');
    return;
  }
  let allVersions = readVersionsFile(filePath);
  let index = 0;
  for (const url of urls) {
    const versions = await fetchAndExtractVersions(url);
    for (const version of versions) {
      if (!allVersions.map(v => v.id).includes(version)) {
        allVersions.splice(++index, 0, {
          version: version,
          id: version
        });
      }
    }
  }
  writeVersionsFile(allVersions, filePath);
}

main();
