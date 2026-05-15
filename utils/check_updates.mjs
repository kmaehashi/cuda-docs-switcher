import fetch from 'node-fetch';
import fs from 'fs';
import { DOMParser } from '@xmldom/xmldom';

// URL list to fetch
const urls = ['https://developer.nvidia.com/cuda-toolkit-archive', 'https://docs.nvidia.com/cuda/archive/'];

// Regex pattern to match
const pattern = /^https:\/\/docs.nvidia.com\/cuda\/archive\/(.+?)\//;

const isNumericVersion = (version) => /^\d+(\.\d+)*$/.test(version);

const compareVersionsDesc = (a, b) => {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);
  const maxLen = Math.max(aParts.length, bParts.length);
  for (let i = 0; i < maxLen; i++) {
    const av = aParts[i] ?? 0;
    const bv = bParts[i] ?? 0;
    if (av > bv) return -1;
    if (av < bv) return 1;
  }
  return 0;
};

const sortVersions = (versions) => {
  if (versions.length <= 1) return versions;
  const [first, ...rest] = versions;
  const sortedRest = [...rest].sort((a, b) => {
    const aNumeric = isNumericVersion(a.version);
    const bNumeric = isNumericVersion(b.version);
    if (aNumeric && bNumeric) {
      return compareVersionsDesc(a.version, b.version);
    }
    if (aNumeric) return -1;
    if (bNumeric) return 1;
    return 0;
  });
  return [first, ...sortedRest];
};

// Check if a URL exists
const checkUrlExists = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn(`Could not check URL ${url}: ${error}`);
    return false;
  }
};

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

  const checkedVersions = [];
  for (const version of versionsFound) {
      const url = `https://docs.nvidia.com/cuda/archive/${version}/`;
      if (await checkUrlExists(url)) {
          checkedVersions.push(version);
      } else {
          console.log(`WARN: ${url} does not exist, skipping`);
      }
  }

  const versions = checkedVersions.filter((href, idx) => {
    return checkedVersions.indexOf(href) === idx;  // Dedup
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
  const existingIds = new Set(allVersions.map(v => v.id));
  for (const url of urls) {
    const versions = await fetchAndExtractVersions(url);
    for (const version of versions) {
      if (!existingIds.has(version)) {
        allVersions.push({
          version: version,
          id: version
        });
        existingIds.add(version);
      }
    }
  }
  writeVersionsFile(sortVersions(allVersions), filePath);
}

main();
