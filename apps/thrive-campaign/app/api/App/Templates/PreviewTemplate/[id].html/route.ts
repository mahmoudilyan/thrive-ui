import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
	params: Promise<{
		id: string;
	}>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
	const { id } = await params;

	// Dummy HTML email template
	const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Email Template Preview - ${id}</title>
	<style>
		body {
			margin: 0;
			padding: 0;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
			background-color: #f5f5f5;
		}
		.email-container {
			max-width: 600px;
			margin: 40px auto;
			background-color: #ffffff;
			border-radius: 8px;
			overflow: hidden;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		}
		.header {
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			padding: 40px 30px;
			text-align: center;
			color: white;
		}
		.header h1 {
			margin: 0;
			font-size: 28px;
			font-weight: 600;
		}
		.content {
			padding: 40px 30px;
		}
		.content h2 {
			color: #333;
			font-size: 24px;
			margin-top: 0;
			margin-bottom: 20px;
		}
		.content p {
			color: #666;
			line-height: 1.6;
			margin-bottom: 20px;
			font-size: 16px;
		}
		.button {
			display: inline-block;
			padding: 14px 32px;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			color: white;
			text-decoration: none;
			border-radius: 6px;
			font-weight: 600;
			margin: 20px 0;
		}
		.features {
			display: flex;
			gap: 20px;
			margin: 30px 0;
		}
		.feature {
			flex: 1;
			text-align: center;
			padding: 20px;
			background-color: #f9fafb;
			border-radius: 6px;
		}
		.feature-icon {
			font-size: 32px;
			margin-bottom: 10px;
		}
		.feature h3 {
			color: #333;
			font-size: 16px;
			margin: 10px 0;
		}
		.footer {
			background-color: #f9fafb;
			padding: 30px;
			text-align: center;
			border-top: 1px solid #e5e7eb;
		}
		.footer p {
			color: #9ca3af;
			font-size: 14px;
			margin: 5px 0;
		}
		.social-links {
			margin: 20px 0;
		}
		.social-links a {
			display: inline-block;
			margin: 0 10px;
			color: #667eea;
			text-decoration: none;
		}
		@media only screen and (max-width: 600px) {
			.email-container {
				margin: 0;
				border-radius: 0;
			}
			.features {
				flex-direction: column;
			}
			.content {
				padding: 30px 20px;
			}
		}
	</style>
</head>
<body>
	<div class="email-container">
		<div class="header">
			<h1>🚀 Welcome to Our Platform</h1>
		</div>
		<div class="content">
			<h2>Hello there!</h2>
			<p>
				We're excited to have you on board. This is a sample email template preview for template ID: <strong>${id}</strong>.
			</p>
			<p>
				Our platform helps you create beautiful, responsive email campaigns that engage your audience and drive results.
			</p>
			<center>
				<a href="#" class="button">Get Started Now</a>
			</center>
			
			<div class="features">
				<div class="feature">
					<div class="feature-icon">📧</div>
					<h3>Easy to Use</h3>
					<p style="font-size: 14px; color: #666;">Create stunning emails in minutes</p>
				</div>
				<div class="feature">
					<div class="feature-icon">📊</div>
					<h3>Track Results</h3>
					<p style="font-size: 14px; color: #666;">Monitor your campaign performance</p>
				</div>
				<div class="feature">
					<div class="feature-icon">🎯</div>
					<h3>Target Audience</h3>
					<p style="font-size: 14px; color: #666;">Reach the right people</p>
				</div>
			</div>

			<p>
				Have questions? Our support team is here to help you succeed. Simply reply to this email or visit our help center.
			</p>
			<p>
				Best regards,<br>
				<strong>The VBOUT Team</strong>
			</p>
		</div>
		<div class="footer">
			<div class="social-links">
				<a href="#">Twitter</a> •
				<a href="#">Facebook</a> •
				<a href="#">LinkedIn</a>
			</div>
			<p>© 2025 VBOUT. All rights reserved.</p>
			<p>123 Email Street, Marketing City, MC 12345</p>
			<p>
				<a href="#" style="color: #667eea;">Unsubscribe</a> |
				<a href="#" style="color: #667eea;">Update Preferences</a>
			</p>
		</div>
	</div>
</body>
</html>
	`;

	return new NextResponse(htmlContent, {
		headers: {
			'Content-Type': 'text/html',
		},
	});
}

