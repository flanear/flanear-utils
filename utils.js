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
    changeMethods: ["ft_transfer"], // change methods modify state
    sender: account, // account object to initialize and sign transactions.
  }
);

const flnContract = new nearAPI.Contract(
  account, // the account object that is connecting
  "fln.flanear.testnet",
  {
    // name of contract you're connecting to
    changeMethods: ["ft_transfer"], // change methods modify state
    sender: account, // account object to initialize and sign transactions.
  }
);

const nftContract = new nearAPI.Contract(
  account,
  'nft.flanear.testnet',
  {
    changeMethods: ['nft_mint'],
  }
);


// transfers some KRK on behalf of flanear.testnet
export async function transferKrk(receiverId, amount) {}

// transfers some FLN on behalf of flanear.testnet
export async function transferFln(receiverId, amount) {}

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
          stamina: 20,
          income: 3,
          recovery: 2,
          energy: 90,
        }),
      }
    },
    "300000000000000", // attached GAS (optional)
    "1000000000000000000000000" // attached deposit in yoctoNEAR (optional)
  );
}