import type { Project } from './types'
export default {
 slug: 'food-ordering', title: 'Food Ordering System', category: 'Web application · Relational data', status: 'Team project · Demo offline', placement: 'featured', order: 3,
 summary: 'A restaurant web app that replaces paper orders with a menu opened from a table QR code. Customers place orders from a phone, while staff review incoming orders by table.',
 contribution: 'Contributed to the team’s Laravel app, designed MySQL tables for menus, inventory, orders, and sales, and implemented QR ordering for individual tables.',
 technologies: ['Laravel', 'MySQL', 'JavaScript', 'Tailwind CSS'],
 sections: [{title: 'Ordering from a table', body: 'Each table has a QR code that opens the corresponding ordering page. Customers browse the menu, add food and drinks to the cart, and submit an order linked to the table. Staff can identify the order location without entering a table number manually.'}, {title: 'Orders and restaurant data', body: 'The staff interface groups orders into pending, preparing, and completed stages. Order cards show the table, item quantities, and customer preferences, with controls for reviewing incoming orders. Laravel and MySQL connect the ordering workflow with menu, inventory, and sales records.'}],
 limitations: 'The hosted demo is offline. The screenshots and public source remain available for inspection.',
 links: [{ label: 'Project source', url: 'https://github.com/EdgyPotato/Food-Ordering-System' }],
 visual: { title: 'Ordering workflow', image: 'projects/food-operations.png', card: 'projects/food-operations-card.webp', alt: 'Molek Cafe operations interface displaying a pending order for Table 1', width: 1919, height: 911, secondaryImage: 'projects/food-menu.png', secondaryCard: 'projects/food-menu-card.webp', secondaryAlt: 'Molek Cafe mobile ordering menu with food items and cart linked to a table', secondaryWidth: 370, secondaryHeight: 802, caption: 'Original restaurant and customer interfaces from the project repository' }
} satisfies Project
