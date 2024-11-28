import { Request, Response } from "express";
import { stripe } from "..";

export const checkoutStripe = async (req: Request, res: Response) => {
	const session = await stripe.checkout.sessions.create({
		mode: "payment",
		success_url: `${req.protocol}://${req.get("host")}/api/stripe/complete?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: "https://github.com",
		line_items: [
			{
				price_data: {
					currency: "usd",
					product_data: {
						name: "Taybeanloic",
						images: ["https://example.com/image.jpg"]
					},
					unit_amount: 75.5 * 100,
				},
				quantity: 1
			},
			{
				price_data: {
					currency: "usd",
					product_data: {
						name: "Taykelinmikaia",
						images: ["https://example.com/image.jpg"]
					},
					unit_amount: 50 * 100,
				},
				quantity: 3
			}
		]
	});
	// res.redirect(session.url!) //tsy mey rah am postman sns fa mandeh tsara
	res.json(session.url);
}

export const checkoutComplete = async (req: Request, res: Response) => {
	const sessionInfo = await Promise.all([
		stripe.checkout.sessions.retrieve(req.query.session_id as string,
			{ expand: ["payment_intent.payment_method"] }
		),
		stripe.checkout.sessions.listLineItems(req.query.session_id as string)
	])
	res.json(sessionInfo);
}
