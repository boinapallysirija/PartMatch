export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  productType: 'Hardware' | 'Software' | 'Kit';
  imageUrl: string;
  sellerName: string;
  sellerId: number;
  stock: number;
  brand: string;
  compatibility: string;
  createdAt: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  imageUrl: string;
  category: string;
}

export interface ProjectComponent {
  id: number;
  projectId: number;
  productId: number;
  quantityRequired: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  addedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  imageUrl: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  total: number;
  pickupLocation: string;
  paymentMethod: string;
  status: 'PLACED' | 'READY_FOR_PICKUP' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  items: OrderItem[];
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Arduino UNO R3",
    description: "Standard ATmega328P microcontroller development board with 14 digital I/O pins, 6 analog inputs, and USB connectivity. Ideal for robotics, sensors, and beginner projects.",
    price: 450,
    originalPrice: 599,
    category: "Microcontrollers",
    condition: "New",
    productType: "Hardware",
    imageUrl: "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&auto=format&fit=crop&q=80",
    sellerName: "Campus Tech Store",
    sellerId: 1,
    stock: 25,
    brand: "Arduino / SparkFun",
    compatibility: "Arduino IDE, C/C++, 5V Logic, IoT Shields",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "ESP32 NodeMCU Wi-Fi + Bluetooth",
    description: "Dual-core 240MHz Tensilica LX6 microcontroller with integrated 802.11b/g/n Wi-Fi and Bluetooth v4.2 BR/EDR and BLE. Perfect for IoT, smart home, and cloud telemetry.",
    price: 650,
    originalPrice: 799,
    category: "Microcontrollers",
    condition: "New",
    productType: "Hardware",
    imageUrl: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80",
    sellerName: "IoT Lab Supplies",
    sellerId: 1,
    stock: 30,
    brand: "Espressif",
    compatibility: "ESP-IDF, Arduino IDE, MicroPython, FreeRTOS",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Raspberry Pi 4 Model B (4GB RAM)",
    description: "High-performance 64-bit quad-core processor single-board computer with dual-band 2.4/5.0 GHz wireless LAN, Bluetooth 5.0, Gigabit Ethernet, and dual 4K display output.",
    price: 4800,
    originalPrice: 5500,
    category: "Boards",
    condition: "Like New",
    productType: "Hardware",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80",
    sellerName: "Senior Project Stock",
    sellerId: 2,
    stock: 8,
    brand: "Raspberry Pi Foundation",
    compatibility: "Raspberry Pi OS, Ubuntu, Python 3, OpenCV, ROS",
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    name: "DHT11 Temperature & Humidity Sensor",
    description: "Digital temperature and humidity sensor module with calibrated digital signal output. Measures 20-90% RH and 0-50°C with single-wire digital interface.",
    price: 120,
    originalPrice: 180,
    category: "Sensors",
    condition: "New",
    productType: "Hardware",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    sellerName: "Campus Tech Store",
    sellerId: 1,
    stock: 45,
    brand: "Aosong",
    compatibility: "Arduino, ESP32, Raspberry Pi, 3.3V-5V",
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    name: "Capacitive Soil Moisture Sensor Module",
    description: "Corrosion-resistant soil moisture detection module with analog voltage output. Operates at 3.3V-5.5V for precision smart agriculture and irrigation automation.",
    price: 100,
    originalPrice: 150,
    category: "Sensors",
    condition: "New",
    productType: "Hardware",
    imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80",
    sellerName: "Campus Tech Store",
    sellerId: 1,
    stock: 35,
    brand: "DFRobot Compatible",
    compatibility: "Arduino, ESP32, STM32, Analog Input ADC",
    createdAt: new Date().toISOString()
  },
  {
    id: 6,
    name: "HC-SR04 Ultrasonic Distance Sensor",
    description: "Non-contact ultrasonic distance measuring module providing 2cm to 400cm ranging accuracy. Operates on 5V with simple Trigger and Echo pin interface.",
    price: 110,
    originalPrice: 160,
    category: "Sensors",
    condition: "New",
    productType: "Hardware",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    sellerName: "Robotics Club",
    sellerId: 3,
    stock: 40,
    brand: "ElecFreaks",
    compatibility: "Arduino, PIC, ARM, Raspberry Pi (via divider)",
    createdAt: new Date().toISOString()
  },
  {
    id: 7,
    name: "5V 1-Channel Relay Module (Optocoupler)",
    description: "5V relay switch board capable of controlling AC 250V 10A / DC 30V 10A loads with optoelectronic isolation to protect low-power microcontrollers.",
    price: 80,
    originalPrice: 120,
    category: "Modules",
    condition: "New",
    productType: "Hardware",
    imageUrl: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80",
    sellerName: "Campus Tech Store",
    sellerId: 1,
    stock: 50,
    brand: "Songle Relay",
    compatibility: "Arduino, ESP8266, ESP32, 5V Active-Low/High",
    createdAt: new Date().toISOString()
  },
  {
    id: 8,
    name: "MB-102 Solderless Breadboard (830 Points)",
    description: "Full-sized 830 tie-point prototyping breadboard with standard 0.1 inch (2.54mm) pitch and dual power distribution rails on both sides.",
    price: 120,
    originalPrice: 199,
    category: "Breadboards",
    condition: "New",
    productType: "Hardware",
    imageUrl: "https://images.unsplash.com/photo-1597733336794-12d05021d510?w=600&auto=format&fit=crop&q=80",
    sellerName: "Lab Essentials",
    sellerId: 1,
    stock: 60,
    brand: "MB-102",
    compatibility: "Standard DIP ICs, Header Pins, Solid Wires 20-29 AWG",
    createdAt: new Date().toISOString()
  },
  {
    id: 9,
    name: "65-Piece Multi-Color Jumper Wire Kit",
    description: "Assorted flexible male-to-male solderless jumper wires in various lengths (10cm, 15cm, 20cm, 25cm) with molded terminal pins for clean breadboard layouts.",
    price: 90,
    originalPrice: 150,
    category: "Wires & Connectors",
    condition: "New",
    productType: "Hardware",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
    sellerName: "Campus Tech Store",
    sellerId: 1,
    stock: 75,
    brand: "General Electronics",
    compatibility: "Standard 2.54mm Headers & Breadboards",
    createdAt: new Date().toISOString()
  },
  {
    id: 10,
    name: "SG90 9g Micro Servo Motor",
    description: "Tiny and lightweight servo motor with 1.8 kg-cm stall torque at 4.8V and 180-degree rotation. Includes 3 servo horns and mounting hardware for robotic arms and steering.",
    price: 150,
    originalPrice: 220,
    category: "Motors",
    condition: "New",
    productType: "Hardware",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80",
    sellerName: "Robotics Club",
    sellerId: 3,
    stock: 30,
    brand: "TowerPro",
    compatibility: "PWM Signals (50Hz), 4.8V-6V Power",
    createdAt: new Date().toISOString()
  },
  {
    id: 11,
    name: "3V-6V Mini Submersible Water Pump",
    description: "DC mini submersible water pump for automated plant watering and liquid dispensing projects. Low noise, 80-120 L/H flow rate with 1 meter PVC tubing included.",
    price: 250,
    originalPrice: 350,
    category: "Motors",
    condition: "New",
    productType: "Hardware",
    imageUrl: "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=80",
    sellerName: "GreenTech Projects",
    sellerId: 2,
    stock: 20,
    brand: "HydroTech",
    compatibility: "3V-6V DC, Relay Driven, Solar or Battery Powered",
    createdAt: new Date().toISOString()
  },
  {
    id: 12,
    name: "0.96 inch I2C OLED Display (128x64)",
    description: "Monochrome OLED display module featuring SSD1306 driver, ultra-wide viewing angles, crisp blue/yellow pixels, and simple 4-pin I2C interface (VCC, GND, SCL, SDA).",
    price: 240,
    originalPrice: 320,
    category: "Displays",
    condition: "New",
    productType: "Hardware",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    sellerName: "Campus Tech Store",
    sellerId: 1,
    stock: 25,
    brand: "Adafruit / Generic",
    compatibility: "I2C Address 0x3C, Adafruit_SSD1306, U8g2",
    createdAt: new Date().toISOString()
  },
  {
    id: 13,
    name: "L298N Dual H-Bridge Motor Driver Module",
    description: "High power dual motor driver module capable of driving two DC motors or one 4-wire two-phase stepper motor up to 2A per channel. Integrated 5V regulator.",
    price: 180,
    originalPrice: 250,
    category: "Modules",
    condition: "Good",
    productType: "Hardware",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    sellerName: "Senior Project Stock",
    sellerId: 2,
    stock: 22,
    brand: "STMicroelectronics Base",
    compatibility: "DC Motors 5V-35V, PWM Speed Control",
    createdAt: new Date().toISOString()
  },
  {
    id: 14,
    name: "HC-SR501 PIR Motion Sensor Module",
    description: "Pyroelectric infrared sensor module for automatic human body motion detection with adjustable delay time (0.3s - 18s) and detection distance (up to 7 meters).",
    price: 130,
    originalPrice: 190,
    category: "Sensors",
    condition: "New",
    productType: "Hardware",
    imageUrl: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&auto=format&fit=crop&q=80",
    sellerName: "Security Tech Supplies",
    sellerId: 1,
    stock: 28,
    brand: "BISS0001",
    compatibility: "3.3V Logic Output, 4.5V-20V DC Input",
    createdAt: new Date().toISOString()
  },
  {
    id: 15,
    name: "5V 2A Regulated DC Power Supply Adapter",
    description: "Universal AC 100V-240V to DC 5V 2000mA power wall adapter with standard 5.5mm x 2.1mm center-positive barrel connector. Overload and short-circuit protection.",
    price: 220,
    originalPrice: 300,
    category: "Power Supplies",
    condition: "New",
    productType: "Hardware",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80",
    sellerName: "Campus Tech Store",
    sellerId: 1,
    stock: 18,
    brand: "PowerSafe",
    compatibility: "Arduino, Raspberry Pi 3, Development Boards",
    createdAt: new Date().toISOString()
  },
  {
    id: 16,
    name: "2WD Smart Robot Chassis with Dual TT DC Motors",
    description: "Transparent acrylic 2-wheel drive robotics chassis platform complete with 2 TT DC gear motors, rubber tires, caster wheel, encoder discs, and battery holder.",
    price: 420,
    originalPrice: 550,
    category: "Robotics",
    condition: "New",
    productType: "Kit",
    imageUrl: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&auto=format&fit=crop&q=80",
    sellerName: "Robotics Club",
    sellerId: 3,
    stock: 15,
    brand: "MakerBotics",
    compatibility: "Arduino, Raspberry Pi, L298N, Micro:bit",
    createdAt: new Date().toISOString()
  },
  {
    id: 17,
    name: "Active 5V Buzzer Module",
    description: "Compact active buzzer module with internal oscillation circuit that sounds continuous 2.5kHz beep whenever 5V power or high logic signal is applied.",
    price: 40,
    originalPrice: 70,
    category: "Modules",
    condition: "New",
    productType: "Hardware",
    imageUrl: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80",
    sellerName: "Campus Tech Store",
    sellerId: 1,
    stock: 80,
    brand: "Generic Audio",
    compatibility: "Direct GPIO pin drive, 3.3V-5V",
    createdAt: new Date().toISOString()
  },
  {
    id: 18,
    name: "LDR Photoresistor Light Sensor Module",
    description: "Light detection module with onboard LDR resistor and LM393 comparator providing both clean digital threshold trigger and continuous analog light readings.",
    price: 60,
    originalPrice: 90,
    category: "Sensors",
    condition: "New",
    productType: "Hardware",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    sellerName: "Campus Tech Store",
    sellerId: 1,
    stock: 40,
    brand: "SunSens",
    compatibility: "Analog ADC, 3.3V-5V Microcontrollers",
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    name: "Smart Irrigation System",
    description: "An automated plant watering system that monitors soil moisture levels in real-time. When soil falls below optimal dryness threshold, it triggers a relay to activate the submersible water pump and delivers precision hydration.",
    difficulty: "Beginner",
    estimatedTime: "2-3 hours",
    imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=700&auto=format&fit=crop&q=80",
    category: "IoT & Agriculture"
  },
  {
    id: 2,
    name: "IoT Weather Station",
    description: "A compact environmental monitoring station that collects ambient temperature and humidity data using DHT11, displays live telemetry metrics on an OLED screen, and transmits weather data over Wi-Fi.",
    difficulty: "Intermediate",
    estimatedTime: "3-4 hours",
    imageUrl: "https://images.unsplash.com/photo-1590055531615-f16d36ffe8ec?w=700&auto=format&fit=crop&q=80",
    category: "Weather & Climate"
  },
  {
    id: 3,
    name: "Smart Home Automation",
    description: "Wireless home automation unit controlling household appliances via local Wi-Fi. Integrates passive infrared motion detection to toggle lighting, power sockets, and fans with high-voltage optocoupler safety.",
    difficulty: "Intermediate",
    estimatedTime: "4-5 hours",
    imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?w=700&auto=format&fit=crop&q=80",
    category: "Home Automation"
  },
  {
    id: 4,
    name: "Smart Security Alarm System",
    description: "Intrusion detection system using PIR sensors to detect unauthorized motion in restricted premises. Immediately triggers an audible alarm buzzer and displays timestamped security breach alerts on an OLED screen.",
    difficulty: "Beginner",
    estimatedTime: "2-3 hours",
    imageUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=700&auto=format&fit=crop&q=80",
    category: "Security & Safety"
  },
  {
    id: 5,
    name: "Automatic Street Light Controller",
    description: "Energy-saving municipal street lighting prototype that measures ambient daylight using an LDR light sensor. Automatically powers high-intensity illumination relays at dusk and deactivates them at dawn.",
    difficulty: "Beginner",
    estimatedTime: "1-2 hours",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=700&auto=format&fit=crop&q=80",
    category: "Automation & Energy"
  },
  {
    id: 6,
    name: "Obstacle Avoiding Autonomous Robot",
    description: "Self-navigating robotic rover that continuously scans its surrounding path using an ultrasonic distance sensor mounted on a sweep servo. When obstacles are detected, it recalculates vectors and steers around them.",
    difficulty: "Intermediate",
    estimatedTime: "4-6 hours",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=700&auto=format&fit=crop&q=80",
    category: "Robotics"
  },
  {
    id: 7,
    name: "Touchless Smart Dustbin",
    description: "Hygienic hands-free waste container that detects hand presence via ultrasonic radar. Automatically swings open the lid using an SG90 micro servo and closes after a designated delay to prevent bacterial spread.",
    difficulty: "Beginner",
    estimatedTime: "2-3 hours",
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=700&auto=format&fit=crop&q=80",
    category: "Automation & Health"
  },
  {
    id: 8,
    name: "IoT Plant Health Monitor",
    description: "Cloud-connected smart greenhouse monitor tracking both soil moisture content and atmospheric temperature/humidity simultaneously, displaying diagnostic status and sending irrigation alerts.",
    difficulty: "Intermediate",
    estimatedTime: "3-4 hours",
    imageUrl: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=700&auto=format&fit=crop&q=80",
    category: "IoT & Agriculture"
  }
];

export const INITIAL_PROJECT_COMPONENTS: ProjectComponent[] = [
  // 1. Smart Irrigation System
  { id: 1, projectId: 1, productId: 1, quantityRequired: 1 },  // Arduino UNO
  { id: 2, projectId: 1, productId: 5, quantityRequired: 1 },  // Soil Moisture Sensor
  { id: 3, projectId: 1, productId: 7, quantityRequired: 1 },  // 5V Relay
  { id: 4, projectId: 1, productId: 11, quantityRequired: 1 }, // Water Pump
  { id: 5, projectId: 1, productId: 8, quantityRequired: 1 },  // Breadboard
  { id: 6, projectId: 1, productId: 9, quantityRequired: 1 },  // Jumper Wires

  // 2. Weather Station
  { id: 7, projectId: 2, productId: 2, quantityRequired: 1 },  // ESP32
  { id: 8, projectId: 2, productId: 4, quantityRequired: 1 },  // DHT11
  { id: 9, projectId: 2, productId: 12, quantityRequired: 1 }, // OLED Display
  { id: 10, projectId: 2, productId: 8, quantityRequired: 1 }, // Breadboard
  { id: 11, projectId: 2, productId: 9, quantityRequired: 1 }, // Jumper Wires

  // 3. Smart Home Automation
  { id: 12, projectId: 3, productId: 2, quantityRequired: 1 }, // ESP32
  { id: 13, projectId: 3, productId: 7, quantityRequired: 1 }, // Relay Module
  { id: 14, projectId: 3, productId: 14, quantityRequired: 1 },// PIR Sensor
  { id: 15, projectId: 3, productId: 15, quantityRequired: 1 },// 5V Power Supply
  { id: 16, projectId: 3, productId: 9, quantityRequired: 1 }, // Jumper Wires

  // 4. Smart Security System
  { id: 17, projectId: 4, productId: 2, quantityRequired: 1 }, // ESP32
  { id: 18, projectId: 4, productId: 14, quantityRequired: 1 },// PIR Sensor
  { id: 19, projectId: 4, productId: 17, quantityRequired: 1 },// Active Buzzer
  { id: 20, projectId: 4, productId: 12, quantityRequired: 1 },// OLED Display
  { id: 21, projectId: 4, productId: 8, quantityRequired: 1 }, // Breadboard

  // 5. Automatic Street Light
  { id: 22, projectId: 5, productId: 1, quantityRequired: 1 }, // Arduino UNO
  { id: 23, projectId: 5, productId: 18, quantityRequired: 1 },// LDR Light Sensor
  { id: 24, projectId: 5, productId: 7, quantityRequired: 1 }, // Relay Module
  { id: 25, projectId: 5, productId: 8, quantityRequired: 1 }, // Breadboard
  { id: 26, projectId: 5, productId: 9, quantityRequired: 1 }, // Jumper Wires

  // 6. Obstacle Avoiding Robot
  { id: 27, projectId: 6, productId: 1, quantityRequired: 1 }, // Arduino UNO
  { id: 28, projectId: 6, productId: 6, quantityRequired: 1 }, // HC-SR04 Ultrasonic
  { id: 29, projectId: 6, productId: 13, quantityRequired: 1 },// L298N Motor Driver
  { id: 30, projectId: 6, productId: 16, quantityRequired: 1 },// 2WD Robot Chassis
  { id: 31, projectId: 6, productId: 10, quantityRequired: 1 },// SG90 Servo
  { id: 32, projectId: 6, productId: 9, quantityRequired: 1 }, // Jumper Wires

  // 7. Touchless Smart Dustbin
  { id: 33, projectId: 7, productId: 1, quantityRequired: 1 }, // Arduino UNO
  { id: 34, projectId: 7, productId: 6, quantityRequired: 1 }, // HC-SR04 Ultrasonic
  { id: 35, projectId: 7, productId: 10, quantityRequired: 1 },// SG90 Servo
  { id: 36, projectId: 7, productId: 8, quantityRequired: 1 }, // Breadboard
  { id: 37, projectId: 7, productId: 9, quantityRequired: 1 }, // Jumper Wires

  // 8. IoT Plant Monitor
  { id: 38, projectId: 8, productId: 2, quantityRequired: 1 }, // ESP32
  { id: 39, projectId: 8, productId: 5, quantityRequired: 1 }, // Soil Moisture Sensor
  { id: 40, projectId: 8, productId: 4, quantityRequired: 1 }, // DHT11 Sensor
  { id: 41, projectId: 8, productId: 12, quantityRequired: 1 },// OLED Display
  { id: 42, projectId: 8, productId: 8, quantityRequired: 1 }  // Breadboard
];

export const INITIAL_USER: User = {
  id: 1,
  name: "Demo Student",
  email: "student@partmatch.com",
  passwordHash: "password123",
  createdAt: new Date().toISOString()
};
