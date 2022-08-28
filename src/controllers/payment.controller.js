import axios from "axios";
import {
  PAYPAL_API,
  PAYPAL_API_CLIENT,
  PAYPAL_API_SECRET,
  HOST,
} from "../config";

export const createOrder = async (req, res, next) => {
  try {
    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "EUR", //https://developer.paypal.com/docs/api/reference/currency-codes/
            value: "593.99",
          },
        },
      ],
      application_context: {
        brand_name: `Trading Alfa Academy`,
        landing_page: "LOGIN", // Default, para mas informacion https://developer.paypal.com/docs/api/orders/v2/#definition-order_application_context
        user_action: "PAY_NOW", // Accion para que en paypal muestre el monto del pago
        return_url: `${HOST}/capture-order`, // Url despues de realizar el pago
        cancel_url: `${HOST}/cancel-order`, // Url despues de realizar el pago
      },
    };

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    const {
      data: { access_token },
    } = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      params,

      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
      }
    );
    console.log(access_token);

    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      order,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    //console.log(response.data);
    res.json(response.data);
  } catch (error) {
    return res.status(500).send("Sorry!, something was wrong");
  }
};
export const captureOrder = async (req, res, next) => {
  const { token, PayerID } = req.query;

  const response = await axios.post(
    `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
    {},
    {
      auth: {
        username: PAYPAL_API_CLIENT,
        password: PAYPAL_API_SECRET,
      },
    }
  );
  console.log(response.data);
  //console.log(token, PayerID);
 //res.send("Capturing Order");
 return res.redirect('payed.html')
};
export const cancelOrder = (req, res, next) => {

  res.redirect('/')
  //res.send("Canceling Order");
};
