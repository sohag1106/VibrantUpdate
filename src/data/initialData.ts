import { Product, Category } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'all', name: 'All Categories', icon: 'Utensils' },
  { id: 'shingara', name: 'Shingara', icon: 'Cookie' },
  { id: 'burger', name: 'Burger', icon: 'Beef' },
  { id: 'meatbox', name: 'Meatbox', icon: 'Box' },
  { id: 'wings', name: 'Wings', icon: 'Flame' },
  { id: 'shawrma', name: 'Shawrma', icon: 'Sparkles' },
  { id: 'subway', name: 'Subway', icon: 'Compass' },
  { id: 'sandwich', name: 'Sandwich', icon: 'Layers' },
  { id: 'juice', name: 'Juice', icon: 'GlassWater' },
  { id: 'coffee', name: 'Coffee', icon: 'Coffee' },
  { id: 'pizza', name: 'Pizza', icon: 'Pizza' },
  { id: 'appetizers', name: 'APPETIZERS', icon: 'Salad' },
  { id: 'pasta', name: 'Pasta', icon: 'ChefHat' },
  { id: 'chowmein', name: 'CHOWMEIN', icon: 'Soup' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Crispy Potato Shingara (4pcs)',
    category: 'shingara',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=300&q=80',
    isAvailable: true,
    modifiers: [
      { id: 'm1', name: 'Spicy Mint Chutney', price: 0.50 },
      { id: 'm2', name: 'Sweet Tamarind Dip', price: 0.50 },
    ]
  },
  {
    id: 'p2',
    name: 'Spicy Beef Keema Shingara (4pcs)',
    category: 'shingara',
    price: 5.49,
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=300&q=80',
    isAvailable: true,
    modifiers: [
      { id: 'm1', name: 'Spicy Mint Chutney', price: 0.50 },
      { id: 'm2', name: 'Sweet Tamarind Dip', price: 0.50 },
    ]
  },
  {
    id: 'p3',
    name: 'Bacon Double Cheeseburger',
    category: 'burger',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
    isAvailable: true,
    modifiers: [
      { id: 'm3', name: 'Extra Cheddar', price: 1.50 },
      { id: 'm4', name: 'Double Patty', price: 3.50 },
      { id: 'm5', name: 'Crispy Bacon strips', price: 2.00 },
      { id: 'm6', name: 'Jalapeno Slices', price: 0.75 },
    ]
  },
  {
    id: 'p4',
    name: 'Spicy Truffle Chicken Burger',
    category: 'burger',
    price: 11.49,
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=300&q=80',
    isAvailable: true,
    modifiers: [
      { id: 'm3', name: 'Extra Cheddar', price: 1.50 },
      { id: 'm7', name: 'Fried Egg', price: 1.25 },
      { id: 'm6', name: 'Jalapeno Slices', price: 0.75 },
    ]
  },
  {
    id: 'p5',
    name: 'Sausage & Fries Meatbox',
    category: 'meatbox',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=300&q=80',
    isAvailable: true,
    modifiers: [
      { id: 'm8', name: 'Extra Garlic Sauce', price: 0.75 },
      { id: 'm9', name: 'Extra Cheese Melt', price: 1.50 },
    ]
  },
  {
    id: 'p6',
    name: 'BBQ Chicken Loaded Meatbox',
    category: 'meatbox',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=300&q=80',
    isAvailable: true,
    modifiers: [
      { id: 'm9', name: 'Extra Cheese Melt', price: 1.50 },
      { id: 'm10', name: 'Smoky BBQ Glaze', price: 1.00 },
    ]
  },
  {
    id: 'p7',
    name: 'Crispy Buffalo Wings (6pcs)',
    category: 'wings',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=300&q=80',
    isAvailable: true,
    modifiers: [
      { id: 'm11', name: 'Blue Cheese Dip', price: 1.00 },
      { id: 'm12', name: 'Celery Sticks', price: 0.75 },
    ]
  },
  {
    id: 'p8',
    name: 'Garlic Parmesan Wings (6pcs)',
    category: 'wings',
    price: 8.49,
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=300&q=80',
    isAvailable: true,
    modifiers: [
      { id: 'm13', name: 'Creamy Ranch Dip', price: 1.00 },
      { id: 'm14', name: 'Extra Parmesan', price: 1.25 },
    ]
  },
  {
    id: 'p9',
    name: 'Classic Chicken Shawarma Wrap',
    category: 'shawrma',
    price: 6.49,
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=300&q=80',
    isAvailable: true,
    modifiers: [
      { id: 'm8', name: 'Extra Garlic Sauce', price: 0.75 },
      { id: 'm15', name: 'Pickled Turnips', price: 0.50 },
    ]
  },
  {
    id: 'p10',
    name: 'Classic Subway Club Sub (6-inch)',
    category: 'subway',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=300&q=80',
    isAvailable: true,
    modifiers: [
      { id: 'm16', name: 'Extra Swiss Cheese', price: 1.25 },
      { id: 'm17', name: 'Honey Mustard Sauce', price: 0.50 },
    ]
  },
  {
    id: 'p11',
    name: 'Club Sandwich with Fries',
    category: 'sandwich',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?auto=format&fit=crop&w=300&q=80',
    isAvailable: true,
    modifiers: [
      { id: 'm5', name: 'Crispy Bacon strips', price: 2.00 },
      { id: 'm7', name: 'Fried Egg', price: 1.25 },
    ]
  },
  {
    id: 'p12',
    name: 'Fresh Mango Juice',
    category: 'juice',
    price: 4.49,
    image: 'https://images.unsplash.com/photo-1546173152-318a724de952?auto=format&fit=crop&w=300&q=80',
    isAvailable: true,
    modifiers: [
      { id: 'm18', name: 'Chia Seeds Add-on', price: 0.75 },
    ]
  },
  {
    id: 'p13',
    name: 'Special Caramel Cold Brew',
    category: 'coffee',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=300&q=80',
    isAvailable: true,
    modifiers: [
      { id: 'm19', name: 'Vanilla Oat Milk', price: 0.75 },
      { id: 'm20', name: 'Double Espresso Shot', price: 1.50 },
    ]
  },
  {
    id: 'p14',
    name: 'Classic Margherita Pizza',
    category: 'pizza',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=300&q=80',
    isAvailable: true,
    modifiers: [
      { id: 'm21', name: 'Extra Mozzarella', price: 2.00 },
      { id: 'm22', name: 'Mushrooms Add-on', price: 1.50 },
    ],
    variants: [
      { id: 'v1', name: 'Small (8")', price: 9.99 },
      { id: 'v2', name: 'Medium (10")', price: 13.99 },
      { id: 'v3', name: 'Large (12")', price: 18.99 }
    ]
  },
  {
    id: 'p14_2',
    name: 'Spicy Double Pepperoni Pizza',
    category: 'pizza',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=300&q=80',
    isAvailable: true,
    modifiers: [
      { id: 'm21', name: 'Extra Mozzarella', price: 2.00 },
      { id: 'm22', name: 'Mushrooms Add-on', price: 1.50 },
      { id: 'm22_pepperoni', name: 'Double Pepperoni', price: 2.50 }
    ],
    variants: [
      { id: 'v4', name: 'Small (8")', price: 11.99 },
      { id: 'v5', name: 'Medium (10")', price: 15.99 },
      { id: 'v6', name: 'Large (12")', price: 21.99 }
    ]
  },
  {
    id: 'p15',
    name: 'Truffle Parmesan Fries',
    category: 'appetizers',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=300&q=80',
    isAvailable: true,
    modifiers: [
      { id: 'm23', name: 'Garlic Aioli Dip', price: 0.75 },
    ]
  },
  {
    id: 'p16',
    name: 'Creamy Chicken Alfredo Pasta',
    category: 'pasta',
    price: 12.49,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=300&q=80',
    isAvailable: true,
    modifiers: [
      { id: 'm24', name: 'Garlic Bread Slices', price: 1.50 },
      { id: 'm25', name: 'Sautéed Mushrooms', price: 1.25 },
    ]
  },
  {
    id: 'p17',
    name: 'Classic Egg & Chicken Chowmein',
    category: 'chowmein',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=300&q=80',
    isAvailable: true,
    modifiers: [
      { id: 'm26', name: 'Extra Egg Scramble', price: 1.00 },
      { id: 'm27', name: 'Chili Garlic Oil', price: 0.50 },
    ]
  }
];

export const MOCK_SALES_HISTORY = {
  todayRevenue: 1842.50,
  totalOrdersToday: 68,
  avgOrderValue: 27.10,
  pendingOrdersCount: 4,
  completedOrdersCount: 62,
  cancelledOrdersCount: 2,
  weeklyTrend: [
    { day: 'Mon', revenue: 1250.00, orders: 48 },
    { day: 'Tue', revenue: 1420.50, orders: 53 },
    { day: 'Wed', revenue: 1842.50, orders: 68 }, // Today
    { day: 'Thu', revenue: 1610.00, orders: 59 },
    { day: 'Fri', revenue: 2450.00, orders: 92 },
    { day: 'Sat', revenue: 3100.25, orders: 114 },
    { day: 'Sun', revenue: 2820.00, orders: 101 },
  ],
  categoryShare: [
    { name: 'Burger', value: 35 },
    { name: 'Pizza', value: 25 },
    { name: 'Shingara', value: 15 },
    { name: 'Wings', value: 12 },
    { name: 'Meatbox', value: 5 },
    { name: 'Pasta', value: 5 },
    { name: 'CHOWMEIN', value: 3 },
  ]
};

// Raw SQL schemas for copying
export const SQL_SCHEMA_CODE = `-- Database Schema for Pay-First POS System (MySQL)

CREATE DATABASE IF NOT EXISTS \`restaurant_pos\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`restaurant_pos\`;

-- 1. Users Table (Staff & Admins)
CREATE TABLE \`users\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`email\` VARCHAR(100) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('admin', 'manager', 'cashier') NOT NULL DEFAULT 'cashier',
  \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_role\` (\`role\`)
) ENGINE=InnoDB;

-- 2. Categories Table
CREATE TABLE \`categories\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(50) NOT NULL UNIQUE,
  \`description\` VARCHAR(255) NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Products Table
CREATE TABLE \`products\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`category_id\` INT UNSIGNED NOT NULL,
  \`name\` VARCHAR(100) NOT NULL,
  \`sku\` VARCHAR(50) UNIQUE NOT NULL,
  \`price\` DECIMAL(10,2) NOT NULL,
  \`cost\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`image_path\` VARCHAR(255) NULL,
  \`is_available\` TINYINT(1) NOT NULL DEFAULT 1,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`category_id\`) REFERENCES \`categories\` (\`id\`) ON DELETE RESTRICT,
  INDEX \`idx_availability\` (\`is_available\`),
  INDEX \`idx_category\` (\`category_id\`)
) ENGINE=InnoDB;

-- 4. Modifiers / Add-ons Table
CREATE TABLE \`modifiers\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`price\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`is_available\` TINYINT(1) NOT NULL DEFAULT 1,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. Product_Modifiers Table (Many-to-Many link)
CREATE TABLE \`product_modifiers\` (
  \`product_id\` INT UNSIGNED NOT NULL,
  \`modifier_id\` INT UNSIGNED NOT NULL,
  PRIMARY KEY (\`product_id\`, \`modifier_id\`),
  FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`modifier_id\`) REFERENCES \`modifiers\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Orders Table (With pay-first status and pricing aggregations)
CREATE TABLE \`orders\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT UNSIGNED NOT NULL, -- Cashier who logged the order
  \`order_number\` VARCHAR(30) UNIQUE NOT NULL,
  \`order_type\` ENUM('dine_in', 'takeaway', 'pickup') NOT NULL,
  \`table_number\` VARCHAR(10) NULL,
  \`subtotal\` DECIMAL(10,2) NOT NULL,
  \`tax\` DECIMAL(10,2) NOT NULL,
  \`discount_value\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`discount_type\` ENUM('flat', 'percentage') NOT NULL DEFAULT 'flat',
  \`discount_amount\` DECIMAL(10,2) NOT NULL DEFAULT 0.00, -- Cash equivalent
  \`total\` DECIMAL(10,2) NOT NULL,
  \`status\` ENUM('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE RESTRICT,
  INDEX \`idx_status\` (\`status\`),
  INDEX \`idx_created_at\` (\`created_at\`)
) ENGINE=InnoDB;

-- 7. Order_Items Table
CREATE TABLE \`order_items\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`order_id\` INT UNSIGNED NOT NULL,
  \`product_id\` INT UNSIGNED NOT NULL,
  \`quantity\` INT UNSIGNED NOT NULL DEFAULT 1,
  \`unit_price\` DECIMAL(10,2) NOT NULL,
  \`notes\` VARCHAR(255) NULL,
  \`total_price\` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (\`order_id\`) REFERENCES \`orders\` (\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`) ON DELETE RESTRICT,
  INDEX \`idx_order_id\` (\`order_id\`)
) ENGINE=InnoDB;

-- 8. Order_Item_Modifiers Table
CREATE TABLE \`order_item_modifiers\` (
  \`order_item_id\` INT UNSIGNED NOT NULL,
  \`modifier_id\` INT UNSIGNED NOT NULL,
  \`price\` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (\`order_item_id\`, \`modifier_id\`),
  FOREIGN KEY (\`order_item_id\`) REFERENCES \`order_items\` (\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`modifier_id\`) REFERENCES \`modifiers\` (\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 9. Transactions Table (Records cash flow, splits, and gateway tokens)
CREATE TABLE \`transactions\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`order_id\` INT UNSIGNED NOT NULL,
  \`payment_method\` ENUM('cash', 'card', 'mobile_pay', 'split') NOT NULL,
  \`amount_paid\` DECIMAL(10,2) NOT NULL,
  \`change_given\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`status\` ENUM('success', 'failed', 'refunded') NOT NULL DEFAULT 'success',
  \`transaction_reference\` VARCHAR(100) NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`order_id\`) REFERENCES \`orders\` (\`id\`) ON DELETE CASCADE,
  INDEX \`idx_order_id\` (\`order_id\`)
) ENGINE=InnoDB;

-- 10. Split_Payments Table
CREATE TABLE \`split_payments\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`transaction_id\` INT UNSIGNED NOT NULL,
  \`person_name\` VARCHAR(100) NOT NULL,
  \`amount\` DECIMAL(10,2) NOT NULL,
  \`payment_method\` ENUM('cash', 'card', 'mobile_pay') NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`transaction_id\`) REFERENCES \`transactions\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;`;

export const PHP_CONTROLLER_CODE = `<?php
declare(strict_types=1);

namespace App\\Controllers;

use App\\Models\\Product;
use App\\Models\\Category;
use Exception;

/**
 * Class ProductController
 * Handles AJX/REST endpoint requests for POS Product CRUD & Modifier assignment.
 */
class ProductController 
{
    private Product $productModel;
    private Category $categoryModel;

    public function __construct() 
    {
        // Enforce Content-Type for clean JSON REST APIs
        header("Content-Type: application/json; charset=UTF-8");
        
        // Dependency Injection of normalized PDO models
        $db = \\App\\Database\\Connection::getInstance()->getConnection();
        $this->productModel = new Product($db);
        $this->categoryModel = new Category($db);
        
        $this->enforceAuthentication();
    }

    /**
     * Get list of all items with optional search and category filters (AJAX optimized)
     */
    public function index(): void 
    {
        try {
            $search = filter_input(INPUT_GET, 'search', FILTER_SANITIZE_SPECIAL_CHARS) ?: '';
            $categoryId = filter_input(INPUT_GET, 'category_id', FILTER_VALIDATE_INT) ?: null;
            $onlyAvailable = filter_input(INPUT_GET, 'only_available', FILTER_VALIDATE_BOOLEAN) ?? false;

            $products = $this->productModel->getAll($search, $categoryId, $onlyAvailable);
            
            echo json_encode([
                "status" => "success",
                "count" => count($products),
                "data" => $products
            ]);
        } catch (Exception $e) {
            $this->respondWithError(500, "Failed to load products: " . $e->getMessage());
        }
    }

    /**
     * Create a new product with modifiers (Strict Pay-First validation)
     */
    public function create(): void 
    {
        $this->enforceRole(['admin', 'manager']);

        try {
            $rawInput = file_get_contents('php://input');
            $data = json_decode($rawInput, true);

            if (!$data) {
                $this->respondWithError(400, "Invalid JSON body provided.");
                return;
            }

            // Input Validation
            $name = trim($data['name'] ?? '');
            $categoryId = filter_var($data['category_id'] ?? null, FILTER_VALIDATE_INT);
            $price = filter_var($data['price'] ?? null, FILTER_VALIDATE_FLOAT);
            $cost = filter_var($data['cost'] ?? 0.00, FILTER_VALIDATE_FLOAT);
            $sku = trim($data['sku'] ?? '');
            $isAvailable = filter_var($data['is_available'] ?? true, FILTER_VALIDATE_BOOLEAN);
            $modifierIds = $data['modifier_ids'] ?? []; // Array of modifier primary keys

            if (empty($name) || !$categoryId || $price === false || empty($sku)) {
                $this->respondWithError(422, "Missing mandatory fields: Name, SKU, Category, and Price are required.");
                return;
            }

            // Transactional Insert to guarantee relationship integrity
            $productId = $this->productModel->createWithModifiers([
                'name' => $name,
                'category_id' => $categoryId,
                'price' => $price,
                'cost' => $cost,
                'sku' => $sku,
                'is_available' => $isAvailable ? 1 : 0
            ], $modifierIds);

            echo json_encode([
                "status" => "success",
                "message" => "Product successfully created with SKU: $sku",
                "productId" => $productId
            ]);

        } catch (Exception $e) {
            $this->respondWithError(500, "Database insertion aborted: " . $e->getMessage());
        }
    }

    /**
     * Update product and stock availability status immediately
     */
    public function update(int $id): void 
    {
        $this->enforceRole(['admin', 'manager']);

        try {
            $rawInput = file_get_contents('php://input');
            $data = json_decode($rawInput, true);

            if (!$this->productModel->exists($id)) {
                $this->respondWithError(404, "Product with ID $id not found.");
                return;
            }

            // Update dynamically
            $fieldsToUpdate = [];
            if (isset($data['name'])) $fieldsToUpdate['name'] = trim($data['name']);
            if (isset($data['category_id'])) $fieldsToUpdate['category_id'] = (int)$data['category_id'];
            if (isset($data['price'])) $fieldsToUpdate['price'] = (float)$data['price'];
            if (isset($data['cost'])) $fieldsToUpdate['cost'] = (float)$data['cost'];
            if (isset($data['sku'])) $fieldsToUpdate['sku'] = trim($data['sku']);
            if (isset($data['is_available'])) $fieldsToUpdate['is_available'] = $data['is_available'] ? 1 : 0;

            $modifierIds = $data['modifier_ids'] ?? null;

            $this->productModel->updateWithModifiers($id, $fieldsToUpdate, $modifierIds);

            echo json_encode([
                "status" => "success",
                "message" => "Product with ID $id updated successfully."
            ]);

        } catch (Exception $e) {
            $this->respondWithError(500, "Update operation failed: " . $e->getMessage());
        }
    }

    /**
     * Handle Product Image Upload
     */
    public function uploadImage(int $productId): void 
    {
        $this->enforceRole(['admin', 'manager']);

        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            $this->respondWithError(400, "No image file provided or upload error occurred.");
            return;
        }

        try {
            $file = $_FILES['image'];
            $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            $maxSize = 2 * 1024 * 1024; // 2MB Limit

            if (!in_array($file['type'], $allowedTypes)) {
                $this->respondWithError(415, "Invalid file format. Only JPG, PNG, and WEBP formats are accepted.");
                return;
            }

            if ($file['size'] > $maxSize) {
                $this->respondWithError(413, "File exceeds maximum upload boundary of 2MB.");
                return;
            }

            // Secure file name hashing to prevent injection attacks
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $secureName = bin2hex(random_bytes(16)) . '.' . $extension;
            $uploadDirectory = __DIR__ . '/../../public/uploads/products/';

            if (!is_dir($uploadDirectory)) {
                mkdir($uploadDirectory, 0755, true);
            }

            $destination = $uploadDirectory . $secureName;
            if (move_uploaded_file($file['tmp_name'], $destination)) {
                $relativePath = '/uploads/products/' . $secureName;
                $this->productModel->updateImagePath($productId, $relativePath);

                echo json_encode([
                    "status" => "success",
                    "message" => "Image uploaded and bound successfully.",
                    "image_path" => $relativePath
                ]);
            } else {
                throw new Exception("File writing failed.");
            }
        } catch (Exception $e) {
            $this->respondWithError(500, "Image writing failed on server: " . $e->getMessage());
        }
    }

    /* --- Security Helper Guards --- */

    private function enforceAuthentication(): void 
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        if (!isset($_SESSION['user_id'])) {
            $this->respondWithError(401, "Unauthenticated access. Please log in first.");
            exit();
        }
    }

    private function enforceRole(array $allowedRoles): void 
    {
        $userRole = $_SESSION['role'] ?? '';
        if (!in_array($userRole, $allowedRoles)) {
            $this->respondWithError(403, "Forbidden. Insufficient operational clearance.");
            exit();
        }
    }

    private function respondWithError(int $statusCode, string $errorMessage): void 
    {
        http_response_code($statusCode);
        echo json_encode([
            "status" => "error",
            "code" => $statusCode,
            "message" => $errorMessage
        ]);
    }
}`;

export const PHP_SALES_REPORT_CODE = `<?php
declare(strict_types=1);

namespace App\\Reports;

use PDO;
use Exception;

/**
 * Class SalesReportGenerator
 * Highly optimized, secure reporting service mapping daily and aggregated financial metrics.
 */
class SalesReportGenerator 
{
    private PDO $db;

    public function __construct(PDO $db) 
    {
        $this->db = $db;
    }

    /**
     * Fetch core POS KPIs within a date boundary
     */
    public function getKPIs(string $startDate, string $endDate): array 
    {
        $query = "
            SELECT 
                COALESCE(SUM(total), 0) as total_revenue,
                COUNT(id) as total_orders,
                COALESCE(AVG(total), 0) as avg_order_value,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_orders,
                COALESCE(SUM(discount_amount), 0) as total_discounts
            FROM orders
            WHERE DATE(created_at) BETWEEN :start_date AND :end_date
              AND status != 'cancelled'
        ";

        try {
            $stmt = $this->db->prepare($query);
            $stmt->execute([
                ':start_date' => $startDate,
                ':end_date' => $endDate
            ]);
            $kpis = $stmt->fetch(PDO::FETCH_ASSOC);

            // Cast results securely to appropriate primitives
            return [
                'total_revenue' => (float)$kpis['total_revenue'],
                'total_orders' => (int)$kpis['total_orders'],
                'avg_order_value' => round((float)$kpis['avg_order_value'], 2),
                'pending_orders' => (int)$kpis['pending_orders'],
                'completed_orders' => (int)$kpis['completed_orders'],
                'total_discounts' => (float)$kpis['total_discounts']
            ];
        } catch (Exception $e) {
            throw new Exception("Error compiling KPIs: " . $e->getMessage());
        }
    }

    /**
     * Retrieve list of detailed transactions for a date range (Ready for spreadsheet export)
     */
    public function getDetailedSalesReport(string $startDate, string $endDate): array 
    {
        $query = "
            SELECT 
                o.order_number,
                o.created_at as order_date,
                o.order_type,
                o.table_number,
                u.username as cashier_name,
                o.subtotal,
                o.tax,
                o.discount_amount as discount,
                o.total,
                o.status as order_status,
                t.payment_method,
                COALESCE(t.amount_paid, o.total) as paid_amount
            FROM orders o
            INNER JOIN users u ON o.user_id = u.id
            LEFT JOIN transactions t ON o.id = t.order_id
            WHERE DATE(o.created_at) BETWEEN :start_date AND :end_date
            ORDER BY o.created_at DESC
        ";

        try {
            $stmt = $this->db->prepare($query);
            $stmt->execute([
                ':start_date' => $startDate,
                ':end_date' => $endDate
            ]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            throw new Exception("Error gathering report dataset: " . $e->getMessage());
        }
    }

    /**
     * Retrieve category-wise product distribution and volume sold
     */
    public function getCategorySalesDistribution(string $startDate, string $endDate): array 
    {
        $query = "
            SELECT 
                c.name as category_name,
                SUM(oi.quantity) as items_sold,
                SUM(oi.total_price) as category_revenue
            FROM order_items oi
            INNER JOIN products p ON oi.product_id = p.id
            INNER JOIN categories c ON p.category_id = c.id
            INNER JOIN orders o ON oi.order_id = o.id
            WHERE DATE(o.created_at) BETWEEN :start_date AND :end_date
              AND o.status = 'completed'
            GROUP BY c.id, c.name
            ORDER BY category_revenue DESC
        ";

        try {
            $stmt = $this->db->prepare($query);
            $stmt->execute([
                ':start_date' => $startDate,
                ':end_date' => $endDate
            ]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            throw new Exception("Failed aggregating categories: " . $e->getMessage());
        }
    }
}`;

export const PHP_EXCEL_EXPORT_CODE = `<?php
declare(strict_types=1);

require __DIR__ . '/../vendor/autoload.php';

use PhpOffice\\PhpSpreadsheet\\Spreadsheet;
use PhpOffice\\PhpSpreadsheet\\Writer\\Xlsx;
use PhpOffice\\PhpSpreadsheet\\Style\\Alignment;
use PhpOffice\\PhpSpreadsheet\\Style\\Border;
use PhpOffice\\PhpSpreadsheet\\Style\\Fill;
use App\\Reports\\SalesReportGenerator;
use App\\Database\\Connection;

// 1. Enforce admin role authentication checks prior to stream initiation
session_start();
if (!isset($_SESSION['user_id']) || !in_array($_SESSION['role'], ['admin', 'manager'])) {
    http_response_code(403);
    die("Unauthorized Access.");
}

$startDate = $_GET['start_date'] ?? date('Y-m-d');
$endDate = $_GET['end_date'] ?? date('Y-m-d');

try {
    $db = Connection::getInstance()->getConnection();
    $reportGenerator = new SalesReportGenerator($db);
    
    // Fetch data from service layers
    $kpis = $reportGenerator->getKPIs($startDate, $endDate);
    $transactions = $reportGenerator->getDetailedSalesReport($startDate, $endDate);

    // 2. Instantiate PhpSpreadsheet Canvas
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    $sheet->setTitle('Sales Report');

    // 3. Set Document Metadata properties
    $spreadsheet->getProperties()
        ->setCreator("Pay-First Restaurant POS")
        ->setLastModifiedBy("POS Automated Report")
        ->setTitle("Sales Report ($startDate to $endDate)")
        ->setSubject("Financial Sales Outflow Report");

    // 4. Build elegant header banners & titles
    $sheet->mergeCells('A1:I1');
    $sheet->setCellValue('A1', 'PAY-FIRST RESTAURANT POS - REVENUE STATEMENT');
    $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16)->setColor(new \\PhpOffice\\PhpSpreadsheet\\Style\\Color('FFFFFF'));
    $sheet->getStyle('A1')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('4F46E5'); // Indigo Blue Theme
    $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

    $sheet->setCellValue('A2', "Date Range: $startDate to $endDate");
    $sheet->getStyle('A2')->getFont()->setItalic(true)->setSize(11);
    $sheet->mergeCells('A2:C2');

    // 5. Build Aggregated KPI Row (Cards representation inside spreadsheet)
    $sheet->setCellValue('A4', 'SUMMARY KPIs');
    $sheet->getStyle('A4')->getFont()->setBold(true);
    
    $sheet->setCellValue('A5', 'Total Revenue');
    $sheet->setCellValue('B5', 'Total Orders');
    $sheet->setCellValue('C5', 'Avg Order Value');
    $sheet->setCellValue('D5', 'Completed Orders');
    $sheet->setCellValue('E5', 'Discount Deductions');

    $sheet->setCellValue('A6', $kpis['total_revenue']);
    $sheet->setCellValue('B6', $kpis['total_orders']);
    $sheet->setCellValue('C6', $kpis['avg_order_value']);
    $sheet->setCellValue('D6', $kpis['completed_orders']);
    $sheet->setCellValue('E6', $kpis['total_discounts']);

    // Style the KPI cards
    $sheet->getStyle('A5:E5')->getFont()->setBold(true)->setColor(new \\PhpOffice\\PhpSpreadsheet\\Style\\Color('FFFFFF'));
    $sheet->getStyle('A5:E5')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('1E293B'); // Slate
    $sheet->getStyle('A6:E6')->getFont()->setSize(12)->setBold(true);
    
    // Format Numbers inside KPIs
    $sheet->getStyle('A6')->getNumberFormat()->setFormatCode('$#,##0.00');
    $sheet->getStyle('C6')->getNumberFormat()->setFormatCode('$#,##0.00');
    $sheet->getStyle('E6')->getNumberFormat()->setFormatCode('$#,##0.00');

    // 6. Detailed Order Rows Mapping
    $headers = [
        'A9' => 'Order Number',
        'B9' => 'Timestamp',
        'C9' => 'Type',
        'D9' => 'Table #',
        'E9' => 'Cashier Name',
        'F9' => 'Subtotal',
        'G9' => 'Tax',
        'H9' => 'Discount',
        'I9' => 'Grand Total',
        'J9' => 'Payment Mode',
        'K9' => 'Status'
    ];

    foreach ($headers as $cell => $val) {
        $sheet->setCellValue($cell, $val);
    }

    $sheet->getStyle('A9:K9')->getFont()->setBold(true)->setColor(new \\PhpOffice\\PhpSpreadsheet\\Style\\Color('FFFFFF'));
    $sheet->getStyle('A9:K9')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('334155'); // Soft Slate Gray

    $currentRow = 10;
    foreach ($transactions as $tx) {
        $sheet->setCellValue('A' . $currentRow, $tx['order_number']);
        $sheet->setCellValue('B' . $currentRow, $tx['order_date']);
        $sheet->setCellValue('C' . $currentRow, strtoupper($tx['order_type']));
        $sheet->setCellValue('D' . $currentRow, $tx['table_number'] ?: 'N/A');
        $sheet->setCellValue('E' . $currentRow, $tx['cashier_name']);
        
        $sheet->setCellValue('F' . $currentRow, (float)$tx['subtotal']);
        $sheet->setCellValue('G' . $currentRow, (float)$tx['tax']);
        $sheet->setCellValue('H' . $currentRow, (float)$tx['discount']);
        $sheet->setCellValue('I' . $currentRow, (float)$tx['total']);
        
        $sheet->setCellValue('J' . $currentRow, strtoupper($tx['payment_method'] ?: 'UNPAID'));
        $sheet->setCellValue('K' . $currentRow, strtoupper($tx['order_status']));

        // Row Specific Number Formats
        $sheet->getStyle('F' . $currentRow)->getNumberFormat()->setFormatCode('$#,##0.00');
        $sheet->getStyle('G' . $currentRow)->getNumberFormat()->setFormatCode('$#,##0.00');
        $sheet->getStyle('H' . $currentRow)->getNumberFormat()->setFormatCode('$#,##0.00');
        $sheet->getStyle('I' . $currentRow)->getNumberFormat()->setFormatCode('$#,##0.00');

        // Color encode status column for clear visibility
        if ($tx['order_status'] === 'completed') {
            $sheet->getStyle('K' . $currentRow)->getFont()->setColor(new \\PhpOffice\\PhpSpreadsheet\\Style\\Color('16A34A')); // Green
        } elseif ($tx['order_status'] === 'cancelled') {
            $sheet->getStyle('K' . $currentRow)->getFont()->setColor(new \\PhpOffice\\PhpSpreadsheet\\Style\\Color('DC2626')); // Red
        }

        $currentRow++;
    }

    // 7. Add Sum aggregations formula in row bottom
    $sheet->setCellValue('E' . $currentRow, 'TOTAL VALUE:');
    $sheet->getStyle('E' . $currentRow)->getFont()->setBold(true);
    $sheet->setCellValue('I' . $currentRow, "=SUM(I10:I" . ($currentRow - 1) . ")");
    $sheet->getStyle('I' . $currentRow)->getFont()->setBold(true)->setSize(11);
    $sheet->getStyle('I' . $currentRow)->getNumberFormat()->setFormatCode('$#,##0.00');

    // 8. Auto-fit column spacing
    foreach (range('A', 'K') as $columnID) {
        $sheet->getColumnDimension($columnID)->setAutoSize(true);
    }

    // 9. Send stream output to browser
    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment;filename="POS_Sales_Report_' . $startDate . '_to_' . $endDate . '.xlsx"');
    header('Cache-Control: max-age=0');
    
    $writer = new Xlsx($spreadsheet);
    $writer->save('php://output');
    exit();

} catch (Exception $e) {
    die("Spreadsheet generation failed: " . $e->getMessage());
}
`;

export const TECHNICAL_GUIDES_CONTENT = {
  rbac: `### Securing Pay-First with Role-Based Access Control (RBAC)

For a fast-paced retail food environment, strict segregation of duties (SoD) prevents checkout shrinkage and theft.

#### 1. Security Architecture
*   **Authentication Engine**: Password hashing strictly uses \`PASSWORD_ARGON2ID\` (or fallback \`PASSWORD_BCRYPT\` with a cost of 12) via PHP's built-in native function:
    \`\`\`php
    $hash = password_hash($password, PASSWORD_ARGON2ID);
    \`\`\`
*   **Session Hardening**: Block Session Hijacking and Session Fixation attacks:
    \`\`\`php
    // session_start configs inside dynamic bootstrappers (e.g., config.php)
    ini_set('session.cookie_secure', '1');     // Enforce HTTPS
    ini_set('session.cookie_httponly', '1');   // Stop XSS script cookie steals
    ini_set('session.use_only_cookies', '1');  // Enforce session ids via cookies only
    ini_set('session.cookie_samesite', 'Strict'); // Stop CSRF
    
    session_start();
    session_regenerate_id(true); // Regenerate key periodically (e.g. after login)
    \`\`\`

#### 2. Middleware & Role Checking Flow
Your router checks specific privileges before firing endpoint execution:

\`\`\`php
// Middleware interface
interface Middleware {
    public function handle(array $params): bool;
}

class RoleMiddleware implements Middleware {
    private array $allowedRoles;

    public function __construct(array $allowedRoles) {
        $this->allowedRoles = $allowedRoles;
    }

    public function handle(array $params): bool {
        if (!isset($_SESSION['role']) || !in_array($_SESSION['role'], $this->allowedRoles)) {
            http_response_code(403);
            echo json_encode(["error" => "Access Forbidden: Insufficient Permissions."]);
            return false;
        }
        return true;
    }
}
\`\`\`

#### 3. CSRF Form Defense
All client-side POST forms include a cryptographically secure token checked on the server backend:
\`\`\`php
// Generate token
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));

// Verify Token (Server side)
if (!hash_equals($_SESSION['csrf_token'] ?? '', $_POST['csrf_token'] ?? '')) {
    http_response_code(400);
    die("Security Check Failed: CSRF Token Invalid.");
}
\`\`\``,

  performance: `### Handling 1,000+ Products & Infinite Sales Records Without Lag

A slow POS at dinner rush means lost sales. Here is how we guarantee sub-100ms interaction latency:

#### 1. Server-Side SQL & Caching Optimizations
*   **Database Indexing**: Adding specific index clusters for rapid lookup sorting:
    \`\`\`sql
    CREATE INDEX idx_products_category_availability ON products (category_id, is_available);
    CREATE INDEX idx_orders_date_status ON orders (created_at, status);
    \`\`\`
*   **Eager Loading Modifiers**: To avoid the notorious \`N+1\` query performance bottleneck, fetch products and modifiers using aggregate group strings, or double queries rather than querying modifiers separately for each loop row.
    \`\`\`sql
    -- Fetching products and their active modifiers in ONE query:
    SELECT p.*, GROUP_CONCAT(CONCAT(m.id, ':', m.name, ':', m.price)) as modifier_list
    FROM products p
    LEFT JOIN product_modifiers pm ON p.id = pm.product_id
    LEFT JOIN modifiers m ON pm.modifier_id = m.id
    WHERE p.is_available = 1
    GROUP BY p.id;
    \`\`\`

#### 2. Client-Side Virtualization & Local Storage Caching
*   **IndexedDB / LocalStorage Products Caching**:
    *   On start, download the complete product catalog as a single highly compressed JSON block and store it in browser-level client databases (IndexedDB / LocalStorage) along with a \`last_updated\` database checksum header.
    *   Whenever cashiers filter or search, the operation executes **locally at microsecond speed**, completely avoiding redundant server roundtrips!
    *   Listen to WebSockets or SSE (Server-Sent Events) for live stock updates or menu updates:
*   **AJAX Debouncing**: When searching, avoid hitting the database for every keystroke. Debounce input events:
    \`\`\`javascript
    let debounceTimer;
    input.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            executeLocalSearch(e.target.value);
        }, 150); // wait 150ms of silence
    });
    \`\`\`
*   **Pagination/Lazy Loading**:
    *   Limit the active grid rendering list to 24-48 visible items. Use lightweight infinite-scrolling logic so that off-screen images are lazy-loaded (\`loading="lazy"\`).`,

  directory: `restaurant-pos/
├── config/
│   ├── connection.php       # PDO Database Singleton pattern class
│   └── secrets.php          # Encryption keys and credential configs
├── src/
│   ├── Controllers/
│   │   ├── AuthController.php
│   │   ├── ProductController.php # Custom AJAX item management controller
│   │   ├── OrderController.php   # Coordinates POS checkout & print triggers
│   │   └── ReportController.php  # Handles excel generation and dashboard APIs
│   ├── Models/
│   │   ├── User.php
│   │   ├── Product.php           # Products database wrapper
│   │   ├── Order.php             # Core logic for tax & items binding
│   │   └── Modifier.php
│   └── Reports/
│       └── SalesReportGenerator.php # Compiled aggregate SQL queries
├── public/
│   ├── index.php             # Bootstrap front-controller & route engine
│   ├── uploads/
│   │   └── products/         # Sanitized uploaded food thumbnail assets
│   ├── css/
│   │   └── style.css         # Compiled tailwind styling
│   └── js/
│       ├── app.js            # POS Cashier interface JS & AJAX handlers
│       └── sales.js          # Admin reports and chart rendering handlers
├── views/
│   ├── layouts/
│   │   ├── header.php
│   │   └── footer.php
│   ├── pos/
│   │   └── index.php         # Beautiful layout for the cashier screen
│   ├── admin/
│   │   ├── products.php      # Products list with modifiers bindings
│   │   └── dashboard.php     # Charts, KPI analytics, and dates selectors
│   └── templates/
│       ├── receipt.php       # HTML Thermal paper template
│       └── kot.php           # Kitchen order ticket template
├── vendor/                   # Composer packages (PhpSpreadsheet, etc.)
├── composer.json             # Core dependencies file
└── .env                      # Kept server-side (Keys & SQL credentials)`
};
