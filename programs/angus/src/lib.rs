use anchor_lang::prelude::*;

declare_id!("HAV4YnfHKvsS31VmcBuwDEGR93zGKanjuzw11YAN3xwB");

#[program]
pub mod angus {
    use super::*;

    pub fn saludar(ctx: Context<Saludar>) -> Result<()> {
        msg!("Hola {:?}!", ctx.accounts.signer.key());

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Saludar<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
}
