const axios = require('axios');
const { PiNetwork } = require('pi-backend');

class PiNetworkService {
  constructor() {
    this.piNetwork = new PiNetwork({
      apiKey: process.env.PI_API_KEY,
      walletPrivateKey: process.env.PI_WALLET_PRIVATE_KEY,
      apiUrl: process.env.NODE_ENV === 'production' 
        ? process.env.PI_NETWORK_API_URL 
        : process.env.PI_NETWORK_SANDBOX_API_URL
    });
  }

  // Authenticate user with Pi Network
  async authenticateUser(accessToken) {
    try {
      const response = await this.piNetwork.authenticateUser(accessToken);
      return response.data;
    } catch (error) {
      console.error('Pi Network authentication error:', error);
      throw error;
    }
  }

  // Create a payment using Pi Network
  async createPayment(amount, memo, userId) {
    try {
      const payment = await this.piNetwork.createPayment({
        amount: amount,
        memo: memo,
        metadata: { userId: userId },
        uid: userId
      });
      return payment;
    } catch (error) {
      console.error('Pi Network payment creation error:', error);
      throw error;
    }
  }

  // Submit a payment for completion
  async submitPayment(paymentId) {
    try {
      const result = await this.piNetwork.submitPayment(paymentId);
      return result;
    } catch (error) {
      console.error('Pi Network payment submission error:', error);
      throw error;
    }
  }

  // Complete a payment
  async completePayment(paymentId, txid) {
    try {
      const result = await this.piNetwork.completePayment(paymentId, txid);
      return result;
    } catch (error) {
      console.error('Pi Network payment completion error:', error);
      throw error;
    }
  }

  // Cancel a payment
  async cancelPayment(paymentId) {
    try {
      const result = await this.piNetwork.cancelPayment(paymentId);
      return result;
    } catch (error) {
      console.error('Pi Network payment cancellation error:', error);
      throw error;
    }
  }

  // Get payment status
  async getPaymentStatus(paymentId) {
    try {
      const status = await this.piNetwork.getPayment(paymentId);
      return status;
    } catch (error) {
      console.error('Pi Network payment status error:', error);
      throw error;
    }
  }
}

module.exports = new PiNetworkService();
