import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import dialogflow from '@google-cloud/dialogflow';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DialogFlowService {
    constructor() {
        console.log('🔧 Initializing DialogFlow Service...');
        
        this.projectId = process.env.DIALOGFLOW_PROJECT_ID || 'webstore-475312';
        
        const credentialsPath = path.join(
            __dirname, 
            '../config/google-credentials/webstore-475312-5398855b0616.json'
        );
        
        console.log(' Project ID:', this.projectId);
        console.log(' Credentials Path:', credentialsPath);
        console.log(' File exists:', fs.existsSync(credentialsPath));
        
        if (!fs.existsSync(credentialsPath)) {
            throw new Error(`Credentials file not found: ${credentialsPath}`);
        }
        
        try {
            this.config = { keyFilename: credentialsPath };
            this.sessionClient = new dialogflow.SessionsClient(this.config);
            console.log('✅ DialogFlow client initialized successfully');
        } catch (error) {
            console.error('❌ DialogFlow client error:', error.message);
            throw error;
        }
    }

    async detectIntent(sessionId, message, languageCode = 'en') {
        console.log(` detectIntent: "${message}"`);
        
        try {
            const sessionPath = this.sessionClient.projectAgentSessionPath(
                this.projectId, 
                sessionId
            );
    
            const request = {
                session: sessionPath,
                queryInput: {
                    text: { text: message, languageCode: languageCode },
                },
            };
    
            console.log(' Sending to DialogFlow...');
            const responses = await this.sessionClient.detectIntent(request);
            const result = responses[0].queryResult;
            
            console.log('✅ Dialogflow raw response:', JSON.stringify(result, null, 2));
            
            // XỬ LÝ RICH PAYLOAD - SỬA QUAN TRỌNG
            let richPayload = null;
            let payload = null;
            
            // 1. Check for webhookPayload (QUAN TRỌNG - Đây là nơi payload thực sự nằm)
            if (result.webhookPayload && result.webhookPayload.fields) {
                console.log('🎁 Found webhookPayload:', result.webhookPayload);
                
                // Convert Dialogflow Struct to plain object
                richPayload = this.convertStructToObject(result.webhookPayload);
                console.log('🔄 Converted webhookPayload:', richPayload);
            }
            
            // 2. Check for custom payload trong fulfillmentMessages
            if (result.fulfillmentMessages) {
                for (const message of result.fulfillmentMessages) {
                    if (message.payload) {
                        console.log('📦 Found fulfillmentMessages payload:', message.payload);
                        payload = message.payload;
                        break;
                    }
                }
            }
            
            // 3. Xử lý fulfillmentText như JSON (fallback)
            if (result.fulfillmentText) {
                try {
                    const parsed = JSON.parse(result.fulfillmentText);
                    console.log('🔍 Parsed fulfillmentText as JSON:', parsed);
                    
                    if (parsed.payload && !richPayload) {
                        richPayload = parsed.payload;
                        console.log('🎁 Found JSON fulfillmentText payload:', richPayload);
                    }
                    
                    if (parsed.fulfillmentText) {
                        result.fulfillmentText = parsed.fulfillmentText;
                    }
                } catch (e) {
                    // Không phải JSON, giữ nguyên text
                    console.log('📝 fulfillmentText is plain text');
                }
            }
    
            return {
                success: true,
                intent: result.intent.displayName,
                confidence: result.intentDetectionConfidence,
                response: result.fulfillmentText,
                parameters: result.parameters.fields,
                payload: payload,
                richPayload: richPayload, // Ưu tiên webhookPayload
                hasOrderInfo: this.checkForOrderIntent(result)
            };
            
        } catch (error) {
            console.error('❌ DialogFlow API error:', error.message);
            return {
                success: false,
                error: error.message,
                response: 'Sorry, I am having technical issues. Please try again later.'
            };
        }
    }
    
    // THÊM HÀM MỚI: Convert Dialogflow Struct to plain object
    convertStructToObject(struct) {
        if (!struct || !struct.fields) return null;
        
        const result = {};
        
        for (const [key, value] of Object.entries(struct.fields)) {
            if (value.kind === 'stringValue') {
                result[key] = value.stringValue;
            } else if (value.kind === 'numberValue') {
                result[key] = value.numberValue;
            } else if (value.kind === 'boolValue') {
                result[key] = value.boolValue;
            } else if (value.kind === 'structValue') {
                result[key] = this.convertStructToObject(value.structValue);
            } else if (value.kind === 'listValue' && value.listValue.values) {
                result[key] = value.listValue.values.map(item => this.convertStructToObject({ fields: { item } }).item);
            } else {
                result[key] = null;
            }
        }
        
        return result;
    }

    checkForOrderIntent(result) {
        const orderIntents = ['track.order', 'check.order.status', 'order.inquiry'];
        return orderIntents.includes(result.intent.displayName);
    }
}

const dialogflowService = new DialogFlowService();

const handleFallback = async (parameters, userMessage) => {
    console.log('🔄 Fallback triggered for message:', userMessage);
    
    const lowerMessage = userMessage.toLowerCase();
    
    let suggestions = '';
    
    if (lowerMessage.includes('return') || lowerMessage.includes('refund') || lowerMessage.includes('exchange')) {
      suggestions = '\n\n💡 **You might be looking for:**\n• Return policy information\n• How to process a return\n• Refund status';
    } else if (lowerMessage.includes('track') || lowerMessage.includes('delivery') || lowerMessage.includes('shipping')) {
      suggestions = '\n\n💡 **You might be looking for:**\n• Order tracking\n• Shipping information\n• Delivery status';
    } else if (lowerMessage.includes('pay') || lowerMessage.includes('payment') || lowerMessage.includes('card')) {
      suggestions = '\n\n💡 **You might be looking for:**\n• Payment methods\n• Payment issues\n• Billing information';
    } else if (lowerMessage.includes('discount') || lowerMessage.includes('deal') || lowerMessage.includes('promo')) {
      suggestions = '\n\n💡 **You might be looking for:**\n• Current promotions\n• Discount codes\n• Special offers';
    } else {
      suggestions = '\n\n💡 **Try asking about:**\n• Product prices and stock\n• Order tracking\n• Shipping information\n• Return policy\n• Payment methods';
    }
  
    return `I'm not quite sure I understand. Could you please rephrase your question?${suggestions}\n\n` +
           `🤝 **Need human assistance? Click "💬 Chat with Admin" below!**\n` +
           `• 📞 Phone: 1-800-HELP-NOW\n` +
           `• 📧 Email: support@webstore.com`;
  };
  
  // Hàm xử lý yêu cầu liên hệ support
  const handleContactRequest = async (parameters) => {
    return `I'll connect you with our admin team! 🚀\n\n` +
           `**Please click the "💬 Chat with Admin" button** that just appeared to get real-time help.\n\n` +
           `Our admin team can assist with:\n` +
           `• Complex order issues\n` +
           `• Payment problems\n` +
           `• Technical support\n` +
           `• Special requests\n\n` +
           `⏰ Response time: Usually within 5-15 minutes during business hours`;
  };

  export const handleWebhook = async (req, res) => {
    try {
      const { queryResult } = req.body;
      const intent = queryResult.intent.displayName;
      const parameters = queryResult.parameters;
  
      console.log(' Webhook received:', { 
          intent, 
          parameters: JSON.stringify(parameters, null, 2)
       });
  
      let response = {
        fulfillmentText: '', // Fallback text
        payload: null, // Rich payload data
        source: 'webstore-backend'
      };
  
      switch (intent) {
        case 'price.inquiry':
          const priceResult = await handlePriceInquiry(parameters);
          response.fulfillmentText = typeof priceResult === 'string' ? priceResult : priceResult.fulfillmentText;
          response.payload = priceResult.payload || null;
          break;
  
          case 'stock.inquiry': 
          const stockResult = await handleStockInquiry(parameters);
          response.fulfillmentText = stockResult;
          break;
  
          case 'product.category':
            const categoryResult = await handleProductCategory(parameters);
            response.fulfillmentText = typeof categoryResult === 'string' ? categoryResult : categoryResult.fulfillmentText;
            response.payload = categoryResult.payload || null;
            break;
  
            case 'product.inquiry':
            const productResult = await handleProductInquiry(parameters);
            response.fulfillmentText = typeof productResult === 'string' ? productResult : productResult.fulfillmentText;
            response.payload = productResult.payload || null;
            break;
  
        case 'shipping.info':
          response.fulfillmentText = await handleShippingInfo(parameters);
          break;
  
          case 'discount.inquiry':  
          const discountResult = await handleDiscountInquiry(parameters);
          response.fulfillmentText = typeof discountResult === 'string' ? discountResult : discountResult.fulfillmentText;
          response.payload = discountResult.payload || null;
          break;
  
        case 'help':
          response.fulfillmentText = await handleHelp(parameters);
          break;
  
        case 'order.tracking':
          response.fulfillmentText = await handleOrderTracking(parameters);
          break;
  
        case 'return.policy':
          response.fulfillmentText = await handleReturnPolicy(parameters);
          break;
  
        case 'payment.method':
          response.fulfillmentText = await handlePaymentMethods(parameters);
          break;
  
        case 'contact.support':
          response.fulfillmentText = await handleContactRequest(parameters);
          break;
  
        case 'Default Welcome Intent':
          response.fulfillmentText = queryResult.fulfillmentText;
          break;
  
        case 'Default Fallback Intent':
          response.fulfillmentText = await handleFallback(parameters, queryResult.queryText);
          break;
  
        default:
          response.fulfillmentText = queryResult.fulfillmentText || await handleFallback(parameters, queryResult.queryText);
      }
      console.log('🎯 Webhook response:', JSON.stringify(response, null, 2));
      res.json(response);
  
    } catch (error) {
      console.error('❌ Webhook error:', error);
      res.json({
        fulfillmentText: 'Sorry, I encountered an error. Please try again later.',
        source: 'webstore-backend'
      });
    }
  };

  const handlePriceInquiry = async (parameters) => {
    console.log('🔍 Raw parameters received:', parameters);
    
    const productName = parameters.fields?.product_name?.stringValue || 
                       parameters.product_name || 
                       parameters.fields?.product_name;
    
    console.log('🎯 Extracted product name:', productName);

    if (!productName) {
      return "Which product would you like to know the price of?";
    }

    console.log('🔍 Searching database for:', productName);

    const products = await Product.find({
      $or: [
        { name: { $regex: productName, $options: 'i' } },
        { brand: { $regex: productName, $options: 'i' } }
      ]
    }).limit(5);

    console.log('📦 Products found:', products.length);

    if (products.length === 0) {
      return `I couldn't find "${productName}" in our store. Try searching for "Macbook Air M1", "iPhone", or "Samsung Galaxy".`;
    }

    if (products.length === 1) {
      const product = products[0];
      
      // TRẢ VỀ RICH PAYLOAD
      return {
        fulfillmentText: `Yes, we have ${product.name}. The price is $${product.price}. ${product.countInStock > 0 ? '✅ In stock' : '❌ Out of stock'}. Rating: ${product.rating}/5`,
        payload: {
          type: 'rich_card',
          product: {
            _id: product._id.toString(),
            name: product.name,
            price: product.price,
            image: product.image,
            brand: product.brand,
            description: product.description?.substring(0, 100) + '...',
            countInStock: product.countInStock,
            rating: product.rating
          }
        }
      };
    }

    // Multiple products - trả về carousel
    return {
      fulfillmentText: `Found ${products.length} matching products. Which specific model are you interested in?`,
      payload: {
        type: 'rich_carousel',
        products: products.map(product => ({
          _id: product._id.toString(),
          name: product.name,
          price: product.price,
          image: product.image,
          brand: product.brand,
          countInStock: product.countInStock,
          rating: product.rating
        }))
      }
    };
};

const handleProductCategory = async (parameters) => {
  const categoryName = parameters.fields?.product_category?.stringValue || parameters.product_category;
  
  const category = await Category.findOne({
    name: { $regex: categoryName, $options: 'i' }
  });

  if (!category) {
    return `Sorry, we don't have a "${categoryName}" category. Available categories are: phones, laptops, tablets, watches, and accessories.`;
  }

  const products = await Product.find({ category: category._id })
    .limit(6)
    .select('name price image');

  if (products.length === 0) {
    return `The ${category.name} category is currently empty.`;
  }

  const productList = products.map(p => 
    `• ${p.name} - $${p.price}`
  ).join('\n');

  return `Here are our ${category.name}:\n${productList}\n\nWould you like more details about any of these?`;
};

// Trong handlePriceInquiry hoặc handleProductInquiry
const handleProductInquiry = async (parameters) => {
    const productName = parameters.fields?.product_name?.stringValue || parameters.product_name;
    
    console.log('🔍 Product inquiry for:', productName);
    
    const product = await Product.findOne({
      name: { $regex: productName, $options: 'i' }
    }).populate('category');

    if (!product) {
      return `Sorry, I couldn't find information about "${productName}".`;
    }

    // TRẢ VỀ RICH PAYLOAD
    return {
      fulfillmentText: `Here's information about ${product.name}: Price: $${product.price}, Brand: ${product.brand}, Rating: ${product.rating}/5`,
      payload: {
        type: 'rich_card',
        product: {
          _id: product._id.toString(),
          name: product.name,
          price: product.price,
          image: product.image,
          brand: product.brand,
          description: product.description,
          countInStock: product.countInStock,
          rating: product.rating,
          category: product.category?.name
        }
      }
    };
};


const extractParameter = (parameters, paramName) => {
    const fields = parameters.fields || parameters;
    
    if (fields[paramName] && fields[paramName].stringValue) {
      return fields[paramName].stringValue;
    }
    if (fields[paramName] && typeof fields[paramName] === 'string') {
      return fields[paramName];
    }
    if (parameters[paramName] && parameters[paramName].stringValue) {
      return parameters[paramName].stringValue;
    }
    if (parameters[paramName] && typeof parameters[paramName] === 'string') {
      return parameters[paramName];
    }
    return null;
  };
  

  const handleShippingInfo = async (parameters) => {
    const location = extractParameter(parameters, 'location');
    const shippingMethod = extractParameter(parameters, 'shipping_method');
  
    console.log('🚚 Shipping info inquiry:', { location, shippingMethod });
  
    let response = "Our shipping information:\n\n";
  
    if (location && shippingMethod) {
      if (shippingMethod.toLowerCase().includes('express')) {
        response += `For express shipping to ${location}, the estimated delivery time is 1-2 business days. The shipping cost is $15.`;
      } else if (shippingMethod.toLowerCase().includes('standard')) {
        response += `For standard shipping to ${location}, the estimated delivery time is 3-5 business days. The shipping cost is $5.`;
      } else {
        response += `For ${shippingMethod} shipping to ${location}, the estimated delivery time is 2-3 business days. The shipping cost ranges from $8 to $12.`;
      }
    } else if (location) {
      response += `For shipping to ${location}, we offer:\n• Standard Shipping: 3-5 business days ($5)\n• Express Shipping: 1-2 business days ($15)\n• Free Shipping: 5-7 business days (on orders over $50)`;
    } else if (shippingMethod) {
      response += `For ${shippingMethod} shipping:\n• Delivery Time: 2-4 business days\n• Cost: $8-12\n• Available for most locations in Vietnam`;
    } else {
      response += "We offer the following shipping options:\n\n• **Standard Shipping**: 3-5 business days ($5)\n• **Express Shipping**: 1-2 business days ($15) \n• **Free Shipping**: 5-7 business days (for orders over $50)\n• **International Shipping**: 7-14 business days (cost varies)\n\nAll orders are processed within 24 hours during business days.";
    }
  
    response += "\n\nDo you have a specific location or shipping method you'd like to know more about?";
    return response;
  };


const handleHelp = async (parameters) => {
  const feature = parameters.fields?.system_feature?.stringValue || parameters.system_feature;
  
  if (feature) {
    return `I can help you with ${feature}. What specific issue are you experiencing?`;
  } else {
    return "I can help you with product information, pricing, shipping details, order tracking, and account issues. What do you need help with?";
  }
};


const handleStockInquiry = async (parameters) => {
    const productName = parameters.fields?.product_name?.stringValue || parameters.product_name;
    
    if (!productName) {
      return "Which product would you like to check stock for?";
    }
  
    console.log('📦 Checking stock for product:', productName);
  
    const products = await Product.find({
      name: { $regex: productName, $options: 'i' }
    }).limit(3);
  
    if (products.length === 0) {
      return `Sorry, I couldn't find "${productName}" in our inventory. Please check the product name.`;
    }
  
    if (products.length === 1) {
      const product = products[0];
      if (product.countInStock > 0) {
        return `✅ We have **${product.countInStock} units** of ${product.name} in stock!`;
      } else {
        return `❌ Sorry, ${product.name} is currently **out of stock**. We'll restock soon!`;
      }
    }
  
    let response = `I found ${products.length} products matching "${productName}":\n\n`;
    products.forEach((product, index) => {
      const stockStatus = product.countInStock > 0 
        ? `✅ ${product.countInStock} in stock` 
        : '❌ Out of stock';
      response += `${index + 1}. **${product.name}**: ${stockStatus}\n`;
    });
    
    return response;
  };

  const handleDiscountInquiry = async (parameters) => {
    const productName = parameters.fields?.product_name?.stringValue || parameters.product_name;
    const categoryName = parameters.fields?.product_category?.stringValue || parameters.product_category;
    const brandName = parameters.fields?.brand?.stringValue || parameters.brand;

    console.log('💰 Discount inquiry for:', { productName, categoryName, brandName });

    try {
      let discountProducts = [];
      let query = {};

      if (productName) {
        query.name = { $regex: productName, $options: 'i' };
      } else if (brandName) {
        query.brand = { $regex: brandName, $options: 'i' };
      } else if (categoryName) {
        const category = await Category.findOne({
          name: { $regex: categoryName, $options: 'i' }
        });
        if (category) {
          query.category = category._id;
        }
      }

      discountProducts = await Product.find(query)
        .limit(6)
        .select('name price brand countInStock rating description image')
        .sort({ rating: -1, price: 1 });

      if (discountProducts.length === 0) {
        return "Currently, we don't have any special promotions for the items you're looking for.";
      }

      // TRẢ VỀ RICH PAYLOAD
      return {
        fulfillmentText: `We have ${discountProducts.length} great deals for you! Check out these discounted products.`,
        payload: {
          type: 'rich_carousel',
          products: discountProducts.map(product => ({
            _id: product._id.toString(),
            name: product.name,
            price: product.price,
            originalPrice: Math.round(product.price * 1.15), // Simulate discount
            image: product.image,
            brand: product.brand,
            countInStock: product.countInStock,
            rating: product.rating,
            isDiscounted: true
          }))
        }
      };

    } catch (error) {
      console.error('❌ Discount inquiry error:', error);
      return "I'm having trouble accessing promotion information right now.";
    }
};

const handleOrderTracking = async (parameters) => {
    const orderNumber = parameters.fields?.order_number?.stringValue || parameters.order_number;
    
    if (!orderNumber) {
      return "Please provide your order number to track your order. You can find it in your order confirmation email or in your account order history.";
    }
  
    console.log('📦 Tracking order:', orderNumber);
  
    try {
      // GIẢ ĐỊNH - Thay bằng Order model thực tế của bạn
      // const order = await Order.findById(orderNumber).populate('user', 'name email');
      
      // Tạm thời dùng mock data
      const mockOrders = {
        '68e905bb3ab8efbac2e3db15': {
          status: 'processing',
          customer: 'john',
          total: 969,
          isPaid: false,
          orderDate: '2024-10-20'
        },
        '68e905bb3ab8efbac2a3db15': {
          status: 'shipped', 
          customer: 'hieu',
          total: 629,
          isPaid: true,
          orderDate: '2024-10-19'
        }
      };
  
      const order = mockOrders[orderNumber];
      
      if (!order) {
        return `I couldn't find order "${orderNumber}" in our system. Please check your order number and try again. Make sure to include the full order ID.`;
      }
  
      const statusMap = {
        'pending': 'is being processed and will be confirmed shortly',
        'processing': 'is being prepared for shipment', 
        'shipped': 'has been shipped and is on its way to you',
        'delivered': 'has been delivered successfully',
        'cancelled': 'was cancelled'
      };
  
      const statusText = statusMap[order.status] || 'is being processed';
      const paidStatus = order.isPaid ? 'Paid' : 'Not paid yet';
      
      return `I found your order ${orderNumber}. Your order ${statusText}. \n\nOrder Details:\n- Customer: ${order.customer}\n- Total Amount: $${order.total}\n- Payment Status: ${paidStatus}\n- Order Date: ${order.orderDate}\n\nThank you for shopping with us! Would you like information about shipping or returns?`;
  
    } catch (error) {
      console.error('❌ Order tracking error:', error);
      return "I'm having trouble accessing order information right now. Please try again later or contact our customer support team for assistance.";
    }
  };

const handleReturnPolicy = async (parameters) => {
    const productCategory = parameters.fields?.product_category?.stringValue || parameters.product_category;
    const brandName = parameters.fields?.brand?.stringValue || parameters.brand;
  
    console.log('🔄 Return policy inquiry for:', { productCategory, brandName });
  
    let specificInfo = '';
    
    if (productCategory) {
      specificInfo = `For ${productCategory} products, `;
    } else if (brandName) {
      specificInfo = `For ${brandName} products, `;
    }
  
    return `${specificInfo}our return policy is as follows:\n\n• You can return any item within 30 days of purchase for a full refund.\n• Products must be in original condition with all packaging and accessories.\n• Electronics items have a 14-day return period for opened products.\n• Shipping costs for returns are the responsibility of the customer unless the item is defective.\n• Refunds are processed within 5-7 business days after we receive the returned item.\n\nDo you have a specific product you'd like to know more about regarding returns?`;
  };


  const handlePaymentMethods = async (parameters) => {
    console.log('💳 Payment methods parameters:', parameters);
    
    const paymentMethod = parameters.fields?.payment_method?.stringValue || 
                         parameters.payment_method;
    
    console.log('🎯 Requested payment method:', paymentMethod);
  
    if (paymentMethod) {
      const method = paymentMethod.toLowerCase();
      
      if (method.includes('paypal')) {
        return `Yes! We accept PayPal. You can use your PayPal account or pay with credit/debit cards through PayPal. It's secure and processes instantly with no extra fees.`;
      } else if (method.includes('credit') || method.includes('debit')) {
        return `Yes! We accept all major credit and debit cards (Visa, MasterCard, American Express). All transactions are SSL encrypted for security with no additional fees.`;
      } else if (method.includes('bank')) {
        return `Yes! Bank transfers are accepted. We'll provide our bank details after order confirmation. Processing takes 1-2 business days.`;
      } else if (method.includes('cash')) {
        return `Yes! Cash on Delivery is available in selected areas. You pay when you receive your order. No extra fees.`;
      } else if (method.includes('digital') || method.includes('apple') || method.includes('google')) {
        return `Yes! We support digital wallets including Apple Pay and Google Pay for fast, secure checkout.`;
      } else {
        return `We accept PayPal, Credit/Debit Cards, Bank Transfer, Cash on Delivery, and Digital Wallets. You can use ${paymentMethod} through one of these methods.`;
      }
    }
  
    // Default response khi không có specific method
    return `We accept:\n\n• **Credit/Debit Cards** (Visa, MasterCard, Amex)\n• **PayPal** \n• **Bank Transfer**\n• **Cash on Delivery**\n• **Digital Wallets** (Apple Pay, Google Pay)\n\nAll payments are secure. Which method would you like details about?`;
  };

// Export cho frontend chat
export const detectIntent = async (sessionId, message) => {
  return await dialogflowService.detectIntent(sessionId, message);
};


export default dialogflowService;