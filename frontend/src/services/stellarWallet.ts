import { Keypair, Server, TransactionBuilder, Networks, Operation, Asset } from 'stellar-sdk';

export interface WalletAccount {
  publicKey: string;
  secretKey: string;
}

export interface Balance {
  balance: string;
  assetType: string;
  assetCode?: string;
}

export class StellarWalletService {
  private server: Server;
  private networkPassphrase: string;

  constructor(isTestnet: boolean = true) {
    this.server = new Server(
      isTestnet 
        ? 'https://horizon-testnet.stellar.org'
        : 'https://horizon.stellar.org'
    );
    this.networkPassphrase = isTestnet ? Networks.TESTNET : Networks.PUBLIC;
  }

  generateKeypair(): WalletAccount {
    const keypair = Keypair.random();
    return {
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret(),
    };
  }

  async fundTestAccount(publicKey: string): Promise<boolean> {
    try {
      const response = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
      return response.ok;
    } catch (error) {
      console.error('Error funding test account:', error);
      return false;
    }
  }

  async getAccountBalance(publicKey: string): Promise<Balance[]> {
    try {
      const account = await this.server.loadAccount(publicKey);
      return account.balances.map(balance => ({
        balance: balance.balance,
        assetType: balance.asset_type,
        assetCode: balance.asset_code,
      }));
    } catch (error) {
      console.error('Error getting account balance:', error);
      return [];
    }
  }

  async sendPayment(
    fromSecret: string,
    toPublicKey: string,
    amount: string,
    assetCode: string = 'XLM'
  ): Promise<string> {
    const sourceKeypair = Keypair.fromSecret(fromSecret);
    const sourceAccount = await this.server.loadAccount(sourceKeypair.publicKey());

    const asset = assetCode === 'XLM' ? Asset.native() : new Asset(assetCode, toPublicKey);

    const transaction = new TransactionBuilder(sourceAccount, {
      fee: await this.server.fetchBaseFee(),
      networkPassphrase: this.networkPassphrase,
    })
      .addOperation(
        Operation.payment({
          destination: toPublicKey,
          asset: asset,
          amount: amount,
        })
      )
      .setTimeout(30)
      .build();

    transaction.sign(sourceKeypair);
    const result = await this.server.submitTransaction(transaction);
    return result.hash;
  }

  validatePublicKey(publicKey: string): boolean {
    try {
      Keypair.fromPublicKey(publicKey);
      return true;
    } catch {
      return false;
    }
  }

  validateSecretKey(secretKey: string): boolean {
    try {
      Keypair.fromSecret(secretKey);
      return true;
    } catch {
      return false;
    }
  }
}

export const stellarWallet = new StellarWalletService();