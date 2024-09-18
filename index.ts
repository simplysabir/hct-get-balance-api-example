import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import {Connection, LAMPORTS_PER_SOL, Keypair, PublicKey} from '@solana/web3.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const rpcUrl = process.env.RPC_URL;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello !');
});

async function fetchSolanaBalance(walletAddress: string) {
    try {
        const url = process.env.SOLANA_RPC_URL!;
        console.log('url', url);
        const connection = new Connection(url!, 'confirmed');
        const publicKey = new PublicKey(walletAddress);
        const balance = await connection.getBalance(publicKey);
        return balance / LAMPORTS_PER_SOL;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


app.get('/solana-balance/:walletaddress', async (req, res) => {
    try {
        const walletAddress = req.params.walletaddress;
        const solBalance = await fetchSolanaBalance(walletAddress);
        res.json({
            walletAddress,
            solBalance
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});