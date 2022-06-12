// Import NEAR API JS
import nearAPI from "near-api-js";
import { parseSeedPhrase } from "near-seed-phrase";

function getKeyPairFromSeedPhrase(seedPhrase) {
  const { secretKey } = parseSeedPhrase(seedPhrase);
  return KeyPair.fromString(secretKey);
}

// Key Store
const { keyStores, KeyPair } = nearAPI;

const keyStore = new keyStores.InMemoryKeyStore();
const SEED_PHRASE = "mango develop grant used hammer vocal nuclear wash increase keep average hospital";

const keyPair = getKeyPairFromSeedPhrase(SEED_PHRASE);
await keyStore.setKey("testnet", "flanear.testnet", keyPair);

// connect
const { connect } = nearAPI;

const config = {
  networkId: "testnet",
  keyStore, 
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
};

const near = await connect(config);
const account = await near.account("flanear.testnet");

const krkContract = new nearAPI.Contract(
  account, // the account object that is connecting
  "krk.flanear.testnet",
  {
    changeMethods: ["register_account", "ft_transfer"], // change methods modify state
    sender: account, // account object to initialize and sign transactions.
  }
);

const flanContract = new nearAPI.Contract(
  account, // the account object that is connecting
  "flan.flanear.testnet",
  {
    // name of contract you're connecting to
    changeMethods: ["register_account", "ft_transfer"], // change methods modify state
    sender: account, // account object to initialize and sign transactions.
  }
);

const nftContract = new nearAPI.Contract(
  account,
  'nft.flanear.testnet',
  {
    changeMethods: ["nft_mint", "nft_token", "update_stats"],
  }
);


// transfers some KRK on behalf of flanear.testnet
export async function transferKrk(receiverId, amount) {
  if (amount > 1000000000) {
    throw new Error("You can not send so much KRK");
  }

  await krkContract.register_account(
    {
      account_id: receiverId,
    },
    "300000000000000", // attached GAS (optional)
    "0" // attached deposit in yoctoNEAR (optional)
  );

  return krkContract.ft_transfer(
    {
      receiver_id: receiverId,
      amount: String(amount),
    },
    "300000000000000", // attached GAS (optional)
    "1" // attached deposit in yoctoNEAR (optional)
  );
}

// transfers some FLN on behalf of flanear.testnet
export async function transferFlan(receiverId, amount) {
  if (amount > 1000000000) {
    throw new Error("You can not send so much FLAN");
  }

  await flanContract.register_account(
    {
      account_id: receiverId,
    },
    "300000000000000", // attached GAS (optional)
    "0" // attached deposit in yoctoNEAR (optional)
  );

  return flanContract.ft_transfer(
    {
      receiver_id: receiverId,
      amount: String(amount),
    },
    "300000000000000", // attached GAS (optional)
    "1" // attached deposit in yoctoNEAR (optional)
  );
}

// mints a new flanear on behalf of flanear.testnet
export async function mintFlanear(receiverId) {
  // contains 70 unique names
  const names = [
    "Aaran", 
    "Aaren", 
    "Aarez", 
    "Aarman", 
    "Aaron", 
    "Aaron-James", 
    "Aarron", 
    "Aaryan", 
    "Aaryn", 
    "Aayan", 
    "Aazaan", 
    "Abaan", 
    "Abbas", 
    "Abdallah", 
    "Abdalroof", 
    "Abdihakim", 
    "Abdirahman", 
    "Abdisalam", 
    "Abdul", 
    "Abdul-Aziz", 
    "Abdulbasir", 
    "Abdulkadir", 
    "Abdulkarem", 
    "Abdulkhader", 
    "Abdullah", 
    "Abdul-Majeed", 
    "Abdulmalik", 
    "Abdul-Rehman", 
    "Abdur", 
    "Abdurraheem", 
    "Abdur-Rahman", 
    "Abdur-Rehmaan", 
    "Abel", 
    "Abhinav", 
    "Abhisumant", 
    "Abid", 
    "Abir", 
    "Abraham", 
    "Abu", 
    "Abubakar", 
    "Ace", 
    "Adain", 
    "Adam", 
    "Adam-James", 
    "Addison", 
    "Addisson", 
    "Adegbola", 
    "Adegbolahan", 
    "Aden", 
    "Adenn", 
    "Adie", 
    "Adil", 
    "Aditya", 
    "Adnan", 
    "Adrian", 
    "Adrien", 
    "Aedan", 
    "Aedin", 
    "Aedyn", 
    "Aeron", 
    "Afonso", 
    "Ahmad", 
    "Ahmed", 
    "Ahmed-Aziz", 
    "Ahoua", 
    "Ahtasham", 
    "Aiadan", 
    "Aidan", 
    "Aiden", 
    "Aiden-Jack"
  ];

  // contains 6 unique descriptions
  const descriptions = [
    "I love NASA",
    "I like pizza",
    "Buy BTC",
    "NEAR TO THE MOOOOOON!",
    ":)",
    ":(",
  ];

  const title = names[Math.floor(Math.random() * 70)];
  const description = descriptions[Math.floor(Math.random() * 6)];
  const media = `https://raw.githubusercontent.com/flanear/token-images/main/${Math.floor(Math.random() * 100)}.png`;

  return nftContract.nft_mint(
    {
      token_id: 'token-' + Date.now(),
      receiver_id: receiverId,
      token_metadata: {
        title: title,
        description: description,
        media: media,
        issued_at: Date.now().toString(),
        extra: JSON.stringify({
          level: 1,
          stamina: Math.floor(Math.random() * 10),
          income: Math.floor(Math.random() * 10),
          recovery: Math.floor(Math.random() * 10),
          energy: Math.floor(Math.random() * 10),
        }),
      }
    },
    "300000000000000", // attached GAS (optional)
    "1000000000000000000000000" // attached deposit in yoctoNEAR (optional)
  );
}