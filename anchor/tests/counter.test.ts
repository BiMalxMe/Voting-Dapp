import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { Keypair, PublicKey } from '@solana/web3.js'
import {Voting} from "../target/types/voting"
import { Anchor } from 'lucide-react';
import { expect,it, beforeAll } from '@jest/globals'; // <--- Correct import for Jest globals
import { describe } from 'node:test';
const IDL = require("../target/idl/voting.json")

const votingAddress  = new PublicKey("FqzkXZdwYjurnUKetJCAvaUw5WAqbwzU6gZEwydeEfqS")

it('counter', async() => {
  const context = await startAnchor("",[{name : "voting",programId : votingAddress}],[]);
  const provider = new BankrunProvider(context);

  const votingProgram = new Program<Voting>(IDL,provider)

  await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "What is your favourite phone brand",
      new anchor.BN(Date.now()/1000),
      new anchor.BN(1852039640/1000 + 3600),
  ).rpc()

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer,"le",8)],
      votingAddress
    )
      const poll = await votingProgram.account.poll.fetch(pollAddress);
      console.log(poll)

      // Use Jest's expect for this assertion
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      expect(poll.pollId.toNumber()).toBe(1);
      expect(poll.description).toBe("What is your favourite phone brand");
      expect(poll.pollStart.toNumber()).toBeGreaterThan(poll.pollEnd.toNumber());
  })
