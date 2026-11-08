const fs = require("fs");
const path = require("path");

async function verify() {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x3e2Ea6a26C7dCDb9996f04ea2BE21fc2b6bC12E3";
  const buildInfoFiles = fs.readdirSync(path.join(__dirname, "../artifacts/build-info"));
  const buildInfoPath = path.join(__dirname, "../artifacts/build-info", buildInfoFiles[0]);
  const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, "utf8"));

  console.log("-----------------------------------------");
  console.log("Verifying RoomMuse on Botchain Explorer via Standard JSON Input");
  console.log("Contract Address:", contractAddress);
  console.log("Compiler:", "v" + buildInfo.solcLongVersion);
  console.log("-----------------------------------------");

  const params = new URLSearchParams();
  params.append("module", "contract");
  params.append("action", "verifysourcecode");
  params.append("contractaddress", contractAddress);
  params.append("sourceCode", JSON.stringify(buildInfo.input));
  params.append("codeformat", "solidity-standard-json-input");
  params.append("contractname", "contracts/RoomMuse.sol:RoomMuse");
  params.append("compilerversion", "v" + buildInfo.solcLongVersion);

  try {
    const res = await fetch("https://scan.bohr.life/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await res.json();
    console.log("Verification submission response:", data);

    if (data.status === "1" || data.message === "OK") {
      const guid = data.result;
      console.log("Submission GUID:", guid);
      console.log("Polling verification status...");

      for (let i = 0; i < 15; i++) {
        await new Promise((r) => setTimeout(r, 4000));
        const statusRes = await fetch(
          `https://scan.bohr.life/api?module=contract&action=checkverifystatus&guid=${guid}`
        );
        const statusData = await statusRes.json();
        console.log(`Status check (${i + 1}/15):`, statusData);

        if (
          statusData.result === "Pass - Verified" ||
          statusData.message === "OK" && statusData.result?.includes("Pass") ||
          statusData.result?.includes("Already Verified")
        ) {
          console.log("SUCCESS: Contract verified on Botchain Explorer!");
          return;
        }
        if (statusData.result && statusData.result.includes("Fail")) {
          console.log("Verification reported:", statusData.result);
          break;
        }
      }
    } else {
      console.log("Submission returned:", data.result || data.message);
    }
  } catch (error) {
    console.error("Verification request error:", error);
  }
}

verify();
