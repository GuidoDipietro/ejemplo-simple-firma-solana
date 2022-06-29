import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Angus } from '../target/types/angus';
import * as assert from 'assert';

const log = (str: string) => {
    console.log('\x1b[33m%s\x1b[0m', str);
};

describe('', () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.Angus as Program<Angus>;

    before(() => {
        log('\n\nClave pública');
        console.log(provider.wallet.publicKey.toBase58());
    });

    it('Falla el envío de transacción sin firmar', async () => {
        // Construcción de transacción sin firmar
        let ix = await program.methods.saludar().instruction();
        let tx = new anchor.web3.Transaction().add(ix);

        log('\n\nTransacción sin firmar:');
        console.log(tx);

        // Intento enviarla
        try {
            await provider.connection.sendTransaction(tx, []);
        } catch (error) {
            assert.ok(error.message.includes('No signers'));
            return;
        }

        assert.fail('Debería haber fallado el envío de una transacción sin firmar');
    });

    it('Envía transacción firmada', async () => {
        // Construcción de transacción sin firmar
        let ix = await program.methods.saludar().instruction();
        let tx = new anchor.web3.Transaction({
            blockhash: (await provider.connection.getLatestBlockhash()).blockhash,
            lastValidBlockHeight: await provider.connection.getBlockHeight(),
        }).add(ix);
        tx.feePayer = provider.wallet.publicKey;

        // La firmo
        let signed_tx = await provider.wallet.signTransaction(tx);

        log('\n\nTransacción firmada:');
        console.log(signed_tx);
        console.log(`\nLongitud de firma: ${signed_tx.signature.length}`);
        console.log(signed_tx.signature.toString('hex').match(/../g).join(' '));

        // Intento enviarla
        await provider.connection.sendRawTransaction(signed_tx.serialize());
    });
});
