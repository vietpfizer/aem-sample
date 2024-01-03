## Introduction

This project with main purpose is to use playwright of typescript to do automated testing.  
It's an E2E and API automation testing framework.

## Project structure

```
e2e-test/                         # Root project directory.
├── api/                          # Api object model directory.
│    └── GoogleApi.ts             # Contains function to interact with google API.
|── config/                       # All configuration for running.
│    └── config.ts                # E2e configuration contains test run, report, base URL, browser.
|── core_lib/                     # Libs directory.
│    └── utilities.ts             # Libs utilities include function for general use.
├── pom/                          # Page object model directory.
│    └── BasePage.ts              # Contains functions that help interacting with page such as click, fill, get text,...
|── tests/                        # Test root directory.
├── .env                          # env: setup environment.
├── .creds.json                   # contains google api access token
├── Google.js                     # Verify account Google, get access token to create or update in file .creds.json
├── .gitignore                    # Files or folders to ignore in a project.
├── package.json                  # Descriptive and functional metadata such as a name, version, and dependencies.
├── README.md                     # README: text file that introduces and explains a project.
└── tsconfig.json                 # The root of a TypeScript project.
```

## Setup environment

1. Install the required library environment: Nodejs: v20.x, npm: 10.x

- Download and install nodejs from link download: https://nodejs.org/en/download  
![1](https://github.com/vietpfizer/aem-sample/assets/87864505/12107d34-ed3e-4a4c-990f-9d26327f75ad)


- Install npm:

```
  npm install npm@latest -g
```

2. Install library of NPM packages:

```
  npm install
```

3. Install browser include chromium, firefox, webkit, ...

```
  npx playwright install
```

For example  
![2](https://github.com/vietpfizer/aem-sample/assets/87864505/db8b94fb-95ab-4f0e-af11-520199e17f0e)


4. Create an .env file in the project to set up the environment

- File .env content

```
# The path(s) to the test file(s) to run. This can be a single file or a glob pattern.
# This variable can hold single value or multiple values separated by comma.
# For example:
#   TEST_FILES_WEB=tests/*.ts                                        //Run all tests with E2E
#   TEST_FILES_WEB=tests/home.spec.ts                                //Run file with E2E
#   TEST_FILES_WEB=tests/home.spec.ts,tests/google_doc.spec.ts       //Run multiple test file with E2E
TEST_FILES_WEB=tests/*.ts         

# The browsers run on the website. Website browser: chromium, firefox, webkit, ...
# This variable can hold single value or multiple values separated by comma.
# For example:
#    BROWSER=chromium                          // Run a browser
#    BROWSER=chromium,firefox,webkit           // Run multiple browsers
BROWSER=chromium

# Base URl E2E
# For example:
#   APP_URL=https://main--aem-sample--vietpfizer.hlx.page
APP_URL=https://main--aem-sample--vietpfizer.hlx.page

# Google information
# Login google
EMAILGG=gapi55814@gmail.com
PASSGG=1qazxsw2@
SECRETGG=465tsx4hy5x5a3jzdv5mdheklbik6dp5

# Google Api Information
CLIENT_ID=543689332838-no088p7huuellfl1heun6efa0inejs1i.apps.googleusercontent.com
CLIENT_SECRET=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
REDIRECT_URI=http://localhost:8000/google/redirect
```

## Run the test script

To Google API
- Run file Google API to automate create or update file creds.json:
```
  npm run google
```

To run test with E2E test:

- Run test file

```
  npm run web
```

- Run test file and view test report:

```
  npm run web.report
```

- Run by headless:

```
  npm run web.headless
```

For example  
![Screenshot 2024-01-03 at 14 12 18](https://github.com/vietpfizer/aem-sample/assets/87864505/f02bfce3-d657-4ad0-a35c-a24fc67f91bd)


- Run with the debug:

```
  npm run web.debug
```

## Report

To view test report:

- View test report:

```
  npm run report
```

For example  
![Screenshot 2024-01-03 at 14 16 41](https://github.com/vietpfizer/aem-sample/assets/87864505/418a3273-2d47-46b4-bc3a-d12b22f274dd)


- View test report with allure report:

```
  npm run report.allure
```

For example  
![Screenshot 2024-01-03 at 14 18 38](https://github.com/vietpfizer/aem-sample/assets/87864505/1291966c-9596-4dc3-942d-bccfe074df79)

