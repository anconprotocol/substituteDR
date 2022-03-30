import { decode, encode } from "cbor-x";
import test from "ava";
import { WakuMessage } from "js-waku";
// import { ByteView } from "multiformats/codecs/interface";
// import { map, tap } from "rxjs";
// import { ChannelCodeEnum } from "parkydb/src/interfaces/BlockCodec";
// import { BlockValue } from "parkydb/src/interfaces/Blockvalue";
import { ParkyDB } from "parkydb";
import { main } from "../src/core/dataRender";
// import { MessagingService } from "parkydb/src/core/messaging";

const payload = {
  commitHash: "xg8pyBr3McqYlUgxAqV0t3s6TRcP+B7MHyPTtyVKMJw=",
  contentHash: {
    "/": "baguqeerahiqryfzwbjc2fn7is4k2uupilwtoxabtb6noifnwxznxszuvrg6a",
  },
  digest:
    "0x5ab3124ede7a511fbc7c6302b164d1547aefda8b5909b6bb637c7da025c3ffaf",
  height: 207,
  issuer: "0x32A21c1bB6E7C20F547e930b53dAC57f42cd25F6",
  key: "YW5jb25wcm90b2NvbC91c2Vycy9kaWQ6ZXRocjpibmJ0OjB4MzJBMjFjMWJCNkU3QzIwRjU0N2U5MzBiNTNkQUM1N2Y0MmNkMjVGNi9iYWd1cWVlcmFoaXFyeWZ6d2JqYzJmbjdpczRrMnV1cGlsd3RveGFidGI2bm9pZm53eHpueHN6dXZyZzZh",
  lastBlockHash: {
    "/": "baguqeeraw4ssfjictj2b47cccep2oioytbjistjke2xuaa35qgdoivtgrwra",
  },
  network: "anconprotocol",
  parentHash: {
    "/": "baguqeerakv6jersryhhanjaihmb2ncdujajxt7gpkfzs7rkur7lo4s5uecwa",
  },
  rootKey:
    "YW5jb25wcm90b2NvbC91c2Vycy9kaWQ6ZXRocjpibmJ0OjB4MzJBMjFjMWJCNkU3QzIwRjU0N2U5MzBiNTNkQUM1N2Y0MmNkMjVGNg==",
  signature:
    "0xa628e3e256a187453c55ffbebc189ec4464c6c0d874a278272d224dbbaa4f6f028d3550651c33edf7af0ea8b3f3806d09ba9135034a61dd1a651c67f83cb06a51b",
  timestamp: 1645384767,
  content: {
    blockchainTokenId: "8",
    blockchainTxHash:
      "0x977dd680952c4f7da1040d12a0a2c9e68a60f6158edee20b1591f91372030670",
    creator: "0x32A21c1bB6E7C20F547e930b53dAC57f42cd25F6",
    currentOrderHash: "",
    description: "me and friends",
    fileExtension: "jpg",
    image:
      "baguqeerar56ywt7p3qbbf6wiqgja5ybvkblz4wx37vyybthr2jl65d657jha",
    name: "Sweden 90s",
    owner: "0x32A21c1bB6E7C20F547e930b53dAC57f42cd25F6",
    price: "",
    sources: [
      "https://tensta.did.pa/v0/file/baguqeerar56ywt7p3qbbf6wiqgja5ybvkblz4wx37vyybthr2jl65d657jha/",
    ],
    tags: "Diseño grafico",
    uuid: "854198e4-1c09-4c27-8103-2ae54adfc681",
  },
};

test.beforeEach(async (t) => {
  const alice = new ParkyDB();
  await alice.initialize({
    // Remember these values come from a CLI or UI, DO NOT hardcode when implementing
    withWallet: {
      password: "qwerty",
      seed: "window alpha view text barely urge minute nasty motion curtain need dinosaur",
    },
  });

  const bob = new ParkyDB();
  await bob.initialize({
    // Remember these values come from a CLI or UI, DO NOT hardcode when implementing
    withWallet: {
      password: "zxcvb",
      seed: "opera offer craft joke defy team prosper tragic reopen street advice moral",
    },
  });

  t.context = {
    db: alice,
    alice,
    bob,
  };
});
test("render server", async (t) => {
  const data = await main();
  console.log(data);
});
test("create topic", async (t) => {
  const { alice, bob }: { alice: ParkyDB; bob: ParkyDB } =
    t.context as any;

  await alice.wallet.addSecp256k1([
    "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
  ]);
  // @ts-ignore
  await alice.wallet.submitPassword(`qwerty`);
  let accounts = await alice.wallet.getAccounts();
  t.is(accounts.length, 1);
  const accountA = accounts[0];

  // @ts-ignore
  await bob.wallet.submitPassword(`zxcvb`);
  accounts = await alice.wallet.getAccounts();
  t.is(accounts.length, 1);
  const accountB = accounts[0];

  const topic = `/anconprotocol/1/marketplace/ipld-dag-json`;
  const pubsubAlice = await alice.createTopicPubsub(topic);
  pubsubAlice.onBlockReply$.subscribe(async (block: WakuMessage) => {
    // match topic
    t.is(topic, JSON.parse(block.payloadAsUtf8).topic);
  });
  const pubsubBob = await bob.createTopicPubsub(topic);
  pubsubBob.onBlockReply$.subscribe(async (block: WakuMessage) => {
    // match topic
    t.is(topic, JSON.parse(block.payloadAsUtf8).topic);
    await bob.putBlock(payload, { topic });
  });

  // Say hi
  await alice.putBlock(payload, { topic });
});
