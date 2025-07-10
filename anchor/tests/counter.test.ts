import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { Keypair, PublicKey } from '@solana/web3.js'
import {Voting} from "../target/types/voting"
import { expect,it, beforeAll } from '@jest/globals'; // <--- Correct import for Jest globals
import { describe } from 'node:test';
const IDL = require("../target/idl/voting.json")

const votingAddress  = new PublicKey("FqzkXZdwYjurnUKetJCAvaUw5WAqbwzU6gZEwydeEfqS")
describe("voting",()=>{
  let context ;
  let provider ;
  let votingProgram: anchor.Program<Voting>;

  beforeAll(async()=>{
     context = await startAnchor("",[{name : "voting",programId : votingAddress}],[]);
     provider = new BankrunProvider(context);
  
     votingProgram = new Program<Voting>(IDL,provider)

  })
it('counter', async() => {
  await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "What is your favourite phone brand",
      new anchor.BN(Date.now()/1000),
      new anchor.BN(Date.now()/1000 + 3600),
  ).rpc()

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer,"le",8)],
      votingAddress
    )
      const poll = await votingProgram.account.poll.fetch(pollAddress);
      console.log(poll)

      expect(poll.pollId.toNumber()).toBe(1);
      expect(poll.description).toBe("What is your favourite phone brand");
      expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
  })

  it('initialize candidates', async () => {
    const [androidid] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer,"le",8),Buffer.from("Android")],
      votingAddress
    )
    const [appleid] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer,"le",8),Buffer.from("Apple")],
      votingAddress
    )
    const [pollpda] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer,"le",8)],
      votingAddress
    )
    await votingProgram.methods.initializeCandidate(
      "Apple", 
      new anchor.BN(1),
    ).rpc()
    const data = votingProgram.account.candidate.fetch(appleid);
    console.log(data)
  });
  it("vote",async() => {
    
  })
})