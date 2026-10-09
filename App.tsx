import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { foodImage } from "./foodImages";

type Goal = "healthy" | "strength" | "fitness" | "fat-loss" | "lean-bulk";
type Page = "home" | "food" | "progress" | "activity" | "coach" | "history" | "profile";
type Profile = { name:string; age:string; sex:string; height:string; weight:string; activity:string; goal:Goal; targetWeight:string; targetDate:string; setupLocked?:boolean };
type Food = { id:number; name:string; calories:number; protein:number; carbs:number; fat:number; serving:string; category:string; image:string };
type FoodLog = Food & { logId:string; quantity:number; date:string; totalCalories:number; totalProtein:number; totalCarbs:number; totalFat:number };
type WeightEntry = { date:string; weight:number };
type ActivityEntry = { id:string; name:string; minutes:number; date:string; image:string; caloriesBurned:number };
type Note = { id:string; date:string; text:string };
type Reminder = { id:string; type:"water"|"food"|"activity"; time:string; enabled:boolean };
type ChatMessage = { id:string; role:"user"|"panda"; text:string; time:number };

const today = new Date().toISOString().slice(0,10);
const img = (q:string) => `https://images.unsplash.com/${q}?auto=format&fit=crop&w=900&q=85`;
const FOOD_DATA:Food[] = [
{id:1,name:"Idli",calories:488,protein:3.8,carbs:33,fat:2.8,serving:"1 serving",category:"Food",image:foodImage(1,"Idli")},
{id:2,name:"Dosa",calories:486,protein:17.6,carbs:51,fat:16.6,serving:"1 serving",category:"Food",image:foodImage(2,"Dosa")},
{id:3,name:"Masala Dosa",calories:393,protein:16.3,carbs:38,fat:15.3,serving:"1 serving",category:"Food",image:foodImage(3,"Masala Dosa")},
{id:4,name:"Rava Dosa",calories:52,protein:6.2,carbs:57,fat:5.2,serving:"1 serving",category:"Food",image:foodImage(4,"Rava Dosa")},
{id:5,name:"Onion Dosa",calories:445,protein:5.5,carbs:50,fat:4.5,serving:"1 serving",category:"Food",image:foodImage(5,"Onion Dosa")},
{id:6,name:"Set Dosa",calories:242,protein:11.2,carbs:47,fat:10.2,serving:"1 serving",category:"Food",image:foodImage(6,"Set Dosa")},
{id:7,name:"Pesarattu",calories:449,protein:15.9,carbs:34,fat:14.9,serving:"1 serving",category:"Food",image:foodImage(7,"Pesarattu")},
{id:8,name:"Uttapam",calories:387,protein:9.7,carbs:32,fat:8.7,serving:"1 serving",category:"Food",image:foodImage(8,"Uttapam")},
{id:9,name:"Appam",calories:347,protein:7.7,carbs:12,fat:6.7,serving:"1 serving",category:"Food",image:foodImage(9,"Appam")},
{id:10,name:"Neer Dosa",calories:312,protein:16.2,carbs:37,fat:15.2,serving:"1 serving",category:"Food",image:foodImage(10,"Neer Dosa")},
{id:11,name:"Idiyappam",calories:186,protein:3.6,carbs:31,fat:2.6,serving:"1 serving",category:"Food",image:foodImage(11,"Idiyappam")},
{id:12,name:"Pongal",calories:397,protein:8.7,carbs:22,fat:7.7,serving:"1 serving",category:"Food",image:foodImage(12,"Pongal")},
{id:13,name:"Upma",calories:277,protein:4.7,carbs:42,fat:3.7,serving:"1 serving",category:"Food",image:foodImage(13,"Upma")},
{id:14,name:"Paniyaram",calories:187,protein:1.7,carbs:12,fat:0.7,serving:"1 serving",category:"Food",image:foodImage(14,"Paniyaram")},
{id:15,name:"Medu Vada",calories:460,protein:9.0,carbs:25,fat:8.0,serving:"1 serving",category:"Food",image:foodImage(15,"Medu Vada")},
{id:16,name:"Masala Vada",calories:361,protein:3.1,carbs:26,fat:2.1,serving:"1 serving",category:"Food",image:foodImage(16,"Masala Vada")},
{id:17,name:"Parotta",calories:76,protein:8.6,carbs:21,fat:7.6,serving:"1 serving",category:"Food",image:foodImage(17,"Parotta")},
{id:18,name:"Kothu Parotta",calories:493,protein:10.3,carbs:38,fat:9.3,serving:"1 serving",category:"Food",image:foodImage(18,"Kothu Parotta")},
{id:19,name:"Poori",calories:176,protein:8.6,carbs:21,fat:7.6,serving:"1 serving",category:"Food",image:foodImage(19,"Poori")},
{id:20,name:"Adai",calories:123,protein:3.3,carbs:28,fat:2.3,serving:"1 serving",category:"Food",image:foodImage(20,"Adai")},
{id:21,name:"Puttu",calories:275,protein:14.5,carbs:20,fat:13.5,serving:"1 serving",category:"Food",image:foodImage(21,"Puttu")},
{id:22,name:"Sambar",calories:323,protein:17.3,carbs:48,fat:16.3,serving:"1 serving",category:"Food",image:foodImage(22,"Sambar")},
{id:23,name:"Rasam",calories:386,protein:17.6,carbs:51,fat:16.6,serving:"1 serving",category:"Food",image:foodImage(23,"Rasam")},
{id:24,name:"Avial",calories:331,protein:2.1,carbs:16,fat:1.1,serving:"1 serving",category:"Food",image:foodImage(24,"Avial")},
{id:25,name:"Poriyal",calories:197,protein:6.7,carbs:62,fat:5.7,serving:"1 serving",category:"Food",image:foodImage(25,"Poriyal")},
{id:26,name:"Kootu",calories:382,protein:5.2,carbs:47,fat:4.2,serving:"1 serving",category:"Food",image:foodImage(26,"Kootu")},
{id:27,name:"Rice",calories:402,protein:3.2,carbs:27,fat:2.2,serving:"1 serving",category:"Food",image:foodImage(27,"Rice")},
{id:28,name:"Jeera Rice",calories:482,protein:5.2,carbs:47,fat:4.2,serving:"1 serving",category:"Food",image:foodImage(28,"Jeera Rice")},
{id:29,name:"Ghee Rice",calories:420,protein:9.0,carbs:25,fat:8.0,serving:"1 serving",category:"Food",image:foodImage(29,"Ghee Rice")},
{id:30,name:"Veg Pulao",calories:447,protein:3.7,carbs:32,fat:2.7,serving:"1 serving",category:"Food",image:foodImage(30,"Veg Pulao")},
{id:31,name:"Peas Pulao",calories:285,protein:15.5,carbs:30,fat:14.5,serving:"1 serving",category:"Food",image:foodImage(31,"Peas Pulao")},
{id:32,name:"Vegetable Biryani",calories:206,protein:7.6,carbs:11,fat:6.6,serving:"1 serving",category:"Food",image:foodImage(32,"Vegetable Biryani")},
{id:33,name:"Chicken Biryani",calories:426,protein:13.6,carbs:11,fat:12.6,serving:"1 serving",category:"Food",image:foodImage(33,"Chicken Biryani")},
{id:34,name:"Mutton Biryani",calories:313,protein:6.3,carbs:58,fat:5.3,serving:"1 serving",category:"Food",image:foodImage(34,"Mutton Biryani")},
{id:35,name:"Egg Biryani",calories:187,protein:11.7,carbs:52,fat:10.7,serving:"1 serving",category:"Food",image:foodImage(35,"Egg Biryani")},
{id:36,name:"Fish Biryani",calories:196,protein:6.6,carbs:61,fat:5.6,serving:"1 serving",category:"Food",image:foodImage(36,"Fish Biryani")},
{id:37,name:"Paneer Biryani",calories:177,protein:8.7,carbs:22,fat:7.7,serving:"1 serving",category:"Food",image:foodImage(37,"Paneer Biryani")},
{id:38,name:"Tandoori Chicken",calories:322,protein:7.2,carbs:7,fat:6.2,serving:"1 serving",category:"Food",image:foodImage(38,"Tandoori Chicken")},
{id:39,name:"Butter Chicken",calories:447,protein:13.7,carbs:12,fat:12.7,serving:"1 serving",category:"Food",image:foodImage(39,"Butter Chicken")},
{id:40,name:"Chicken Tikka",calories:345,protein:17.5,carbs:50,fat:16.5,serving:"1 serving",category:"Food",image:foodImage(40,"Chicken Tikka")},
{id:41,name:"Chicken Curry",calories:243,protein:7.3,carbs:8,fat:6.3,serving:"1 serving",category:"Food",image:foodImage(41,"Chicken Curry")},
{id:42,name:"Mutton Curry",calories:223,protein:3.3,carbs:28,fat:2.3,serving:"1 serving",category:"Food",image:foodImage(42,"Mutton Curry")},
{id:43,name:"Fish Curry",calories:145,protein:13.5,carbs:10,fat:12.5,serving:"1 serving",category:"Food",image:foodImage(43,"Fish Curry")},
{id:44,name:"Egg Curry",calories:85,protein:5.5,carbs:50,fat:4.5,serving:"1 serving",category:"Food",image:foodImage(44,"Egg Curry")},
{id:45,name:"Dal Tadka",calories:450,protein:2.0,carbs:15,fat:1.0,serving:"1 serving",category:"Food",image:foodImage(45,"Dal Tadka")},
{id:46,name:"Dal Fry",calories:346,protein:3.6,carbs:31,fat:2.6,serving:"1 serving",category:"Food",image:foodImage(46,"Dal Fry")},
{id:47,name:"Rajma Masala",calories:212,protein:10.2,carbs:37,fat:9.2,serving:"1 serving",category:"Food",image:foodImage(47,"Rajma Masala")},
{id:48,name:"Chole Masala",calories:390,protein:4.0,carbs:35,fat:3.0,serving:"1 serving",category:"Food",image:foodImage(48,"Chole Masala")},
{id:49,name:"Palak Paneer",calories:172,protein:18.2,carbs:57,fat:17.2,serving:"1 serving",category:"Food",image:foodImage(49,"Palak Paneer")},
{id:50,name:"Shahi Paneer",calories:55,protein:10.5,carbs:40,fat:9.5,serving:"1 serving",category:"Food",image:foodImage(50,"Shahi Paneer")},
{id:51,name:"Kadai Paneer",calories:287,protein:1.7,carbs:12,fat:0.7,serving:"1 serving",category:"Food",image:foodImage(51,"Kadai Paneer")},
{id:52,name:"Aloo Gobi",calories:460,protein:7.0,carbs:5,fat:6.0,serving:"1 serving",category:"Food",image:foodImage(52,"Aloo Gobi")},
{id:53,name:"Aloo Matar",calories:273,protein:18.3,carbs:58,fat:17.3,serving:"1 serving",category:"Food",image:foodImage(53,"Aloo Matar")},
{id:54,name:"Baingan Bharta",calories:260,protein:3.0,carbs:25,fat:2.0,serving:"1 serving",category:"Food",image:foodImage(54,"Baingan Bharta")},
{id:55,name:"Bhindi Masala",calories:190,protein:16.0,carbs:35,fat:15.0,serving:"1 serving",category:"Food",image:foodImage(55,"Bhindi Masala")},
{id:56,name:"Mixed Vegetable Curry",calories:478,protein:14.8,carbs:23,fat:13.8,serving:"1 serving",category:"Food",image:foodImage(56,"Mixed Vegetable Curry")},
{id:57,name:"Kadhi",calories:412,protein:10.2,carbs:37,fat:9.2,serving:"1 serving",category:"Food",image:foodImage(57,"Kadhi")},
{id:58,name:"Pav Bhaji",calories:434,protein:4.4,carbs:39,fat:3.4,serving:"1 serving",category:"Food",image:foodImage(58,"Pav Bhaji")},
{id:59,name:"Chole Bhature",calories:192,protein:14.2,carbs:17,fat:13.2,serving:"1 serving",category:"Food",image:foodImage(59,"Chole Bhature")},
{id:60,name:"Pani Puri",calories:64,protein:3.4,carbs:29,fat:2.4,serving:"1 serving",category:"Food",image:foodImage(60,"Pani Puri")},
{id:61,name:"Bhel Puri",calories:497,protein:4.7,carbs:42,fat:3.7,serving:"1 serving",category:"Food",image:foodImage(61,"Bhel Puri")},
{id:62,name:"Sev Puri",calories:275,protein:10.5,carbs:40,fat:9.5,serving:"1 serving",category:"Food",image:foodImage(62,"Sev Puri")},
{id:63,name:"Dahi Puri",calories:53,protein:18.3,carbs:58,fat:17.3,serving:"1 serving",category:"Food",image:foodImage(63,"Dahi Puri")},
{id:64,name:"Samosa",calories:413,protein:14.3,carbs:18,fat:13.3,serving:"1 serving",category:"Food",image:foodImage(64,"Samosa")},
{id:65,name:"Kachori",calories:247,protein:1.7,carbs:12,fat:0.7,serving:"1 serving",category:"Food",image:foodImage(65,"Kachori")},
{id:66,name:"Pakora",calories:347,protein:11.7,carbs:52,fat:10.7,serving:"1 serving",category:"Food",image:foodImage(66,"Pakora")},
{id:67,name:"Aloo Tikki",calories:450,protein:2.0,carbs:15,fat:1.0,serving:"1 serving",category:"Food",image:foodImage(67,"Aloo Tikki")},
{id:68,name:"Dhokla",calories:225,protein:5.5,carbs:50,fat:4.5,serving:"1 serving",category:"Food",image:foodImage(68,"Dhokla")},
{id:69,name:"Thepla",calories:82,protein:15.2,carbs:27,fat:14.2,serving:"1 serving",category:"Food",image:foodImage(69,"Thepla")},
{id:70,name:"Poha",calories:123,protein:5.3,carbs:48,fat:4.3,serving:"1 serving",category:"Food",image:foodImage(70,"Poha")},
{id:71,name:"Sabudana Khichdi",calories:424,protein:5.4,carbs:49,fat:4.4,serving:"1 serving",category:"Food",image:foodImage(71,"Sabudana Khichdi")},
{id:72,name:"Misal Pav",calories:141,protein:15.1,carbs:26,fat:14.1,serving:"1 serving",category:"Food",image:foodImage(72,"Misal Pav")},
{id:73,name:"Vada Pav",calories:476,protein:16.6,carbs:41,fat:15.6,serving:"1 serving",category:"Food",image:foodImage(73,"Vada Pav")},
{id:74,name:"Chapati",calories:458,protein:2.8,carbs:23,fat:1.8,serving:"1 serving",category:"Food",image:foodImage(74,"Chapati")},
{id:75,name:"Roti",calories:120,protein:1.0,carbs:5,fat:0.0,serving:"1 serving",category:"Food",image:foodImage(75,"Roti")},
{id:76,name:"Naan",calories:455,protein:2.5,carbs:20,fat:1.5,serving:"1 serving",category:"Food",image:foodImage(76,"Naan")},
{id:77,name:"Butter Naan",calories:98,protein:16.8,carbs:43,fat:15.8,serving:"1 serving",category:"Food",image:foodImage(77,"Butter Naan")},
{id:78,name:"Garlic Naan",calories:275,protein:2.5,carbs:20,fat:1.5,serving:"1 serving",category:"Food",image:foodImage(78,"Garlic Naan")},
{id:79,name:"Kulcha",calories:387,protein:1.7,carbs:12,fat:0.7,serving:"1 serving",category:"Food",image:foodImage(79,"Kulcha")},
{id:80,name:"Aloo Paratha",calories:66,protein:5.6,carbs:51,fat:4.6,serving:"1 serving",category:"Food",image:foodImage(80,"Aloo Paratha")},
{id:81,name:"Gobi Paratha",calories:77,protein:10.7,carbs:42,fat:9.7,serving:"1 serving",category:"Food",image:foodImage(81,"Gobi Paratha")},
{id:82,name:"Paneer Paratha",calories:460,protein:7.0,carbs:5,fat:6.0,serving:"1 serving",category:"Food",image:foodImage(82,"Paneer Paratha")},
{id:83,name:"Methi Paratha",calories:286,protein:1.6,carbs:11,fat:0.6,serving:"1 serving",category:"Food",image:foodImage(83,"Methi Paratha")},
{id:84,name:"Lachha Paratha",calories:47,protein:13.7,carbs:12,fat:12.7,serving:"1 serving",category:"Food",image:foodImage(84,"Lachha Paratha")},
{id:85,name:"Bajra Roti",calories:339,protein:4.9,carbs:44,fat:3.9,serving:"1 serving",category:"Food",image:foodImage(85,"Bajra Roti")},
{id:86,name:"Jowar Roti",calories:412,protein:18.2,carbs:57,fat:17.2,serving:"1 serving",category:"Food",image:foodImage(86,"Jowar Roti")},
{id:87,name:"Makki Roti",calories:221,protein:1.1,carbs:6,fat:0.1,serving:"1 serving",category:"Food",image:foodImage(87,"Makki Roti")},
{id:88,name:"Omelette",calories:176,protein:16.6,carbs:41,fat:15.6,serving:"1 serving",category:"Food",image:foodImage(88,"Omelette")},
{id:89,name:"Boiled Egg",calories:121,protein:11.1,carbs:46,fat:10.1,serving:"1 serving",category:"Food",image:foodImage(89,"Boiled Egg")},
{id:90,name:"Scrambled Egg",calories:109,protein:9.9,carbs:34,fat:8.9,serving:"1 serving",category:"Food",image:foodImage(90,"Scrambled Egg")},
{id:91,name:"Egg Bhurji",calories:134,protein:12.4,carbs:59,fat:11.4,serving:"1 serving",category:"Food",image:foodImage(91,"Egg Bhurji")},
{id:92,name:"French Toast",calories:156,protein:6.6,carbs:61,fat:5.6,serving:"1 serving",category:"Food",image:foodImage(92,"French Toast")},
{id:93,name:"Pancakes",calories:388,protein:17.8,carbs:53,fat:16.8,serving:"1 serving",category:"Food",image:foodImage(93,"Pancakes")},
{id:94,name:"Waffles",calories:259,protein:10.9,carbs:44,fat:9.9,serving:"1 serving",category:"Food",image:foodImage(94,"Waffles")},
{id:95,name:"Oatmeal",calories:265,protein:1.5,carbs:10,fat:0.5,serving:"1 serving",category:"Food",image:foodImage(95,"Oatmeal")},
{id:96,name:"Granola Bowl",calories:379,protein:8.9,carbs:24,fat:7.9,serving:"1 serving",category:"Food",image:foodImage(96,"Granola Bowl")},
{id:97,name:"Muesli Bowl",calories:46,protein:3.6,carbs:31,fat:2.6,serving:"1 serving",category:"Food",image:foodImage(97,"Muesli Bowl")},
{id:98,name:"Avocado Toast",calories:95,protein:16.5,carbs:40,fat:15.5,serving:"1 serving",category:"Food",image:foodImage(98,"Avocado Toast")},
{id:99,name:"Peanut Butter Toast",calories:243,protein:11.3,carbs:48,fat:10.3,serving:"1 serving",category:"Food",image:foodImage(99,"Peanut Butter Toast")},
{id:100,name:"Vegetable Sandwich",calories:90,protein:8.0,carbs:15,fat:7.0,serving:"1 serving",category:"Food",image:foodImage(100,"Vegetable Sandwich")},
{id:101,name:"Grilled Sandwich",calories:48,protein:7.8,carbs:13,fat:6.8,serving:"1 serving",category:"Food",image:foodImage(101,"Grilled Sandwich")},
{id:102,name:"Egg Sandwich",calories:233,protein:2.3,carbs:18,fat:1.3,serving:"1 serving",category:"Food",image:foodImage(102,"Egg Sandwich")},
{id:103,name:"Chicken Sandwich",calories:64,protein:3.4,carbs:29,fat:2.4,serving:"1 serving",category:"Food",image:foodImage(103,"Chicken Sandwich")},
{id:104,name:"Paneer Sandwich",calories:426,protein:5.6,carbs:51,fat:4.6,serving:"1 serving",category:"Food",image:foodImage(104,"Paneer Sandwich")},
{id:105,name:"Apple",calories:440,protein:1.0,carbs:5,fat:0.0,serving:"1 serving",category:"Food",image:foodImage(105,"Apple")},
{id:106,name:"Banana",calories:315,protein:12.5,carbs:60,fat:11.5,serving:"1 serving",category:"Food",image:foodImage(106,"Banana")},
{id:107,name:"Orange",calories:296,protein:10.6,carbs:41,fat:9.6,serving:"1 serving",category:"Food",image:foodImage(107,"Orange")},
{id:108,name:"Mango",calories:494,protein:14.4,carbs:19,fat:13.4,serving:"1 serving",category:"Food",image:foodImage(108,"Mango")},
{id:109,name:"Papaya",calories:104,protein:7.4,carbs:9,fat:6.4,serving:"1 serving",category:"Food",image:foodImage(109,"Papaya")},
{id:110,name:"Pineapple",calories:425,protein:5.5,carbs:50,fat:4.5,serving:"1 serving",category:"Food",image:foodImage(110,"Pineapple")},
{id:111,name:"Watermelon",calories:451,protein:16.1,carbs:36,fat:15.1,serving:"1 serving",category:"Drinks",image:foodImage(111,"Watermelon")},
{id:112,name:"Muskmelon",calories:236,protein:12.6,carbs:61,fat:11.6,serving:"1 serving",category:"Food",image:foodImage(112,"Muskmelon")},
{id:113,name:"Grapes",calories:246,protein:1.6,carbs:11,fat:0.6,serving:"1 serving",category:"Food",image:foodImage(113,"Grapes")},
{id:114,name:"Strawberry",calories:412,protein:6.2,carbs:57,fat:5.2,serving:"1 serving",category:"Food",image:foodImage(114,"Strawberry")},
{id:115,name:"Blueberry",calories:92,protein:14.2,carbs:17,fat:13.2,serving:"1 serving",category:"Food",image:foodImage(115,"Blueberry")},
{id:116,name:"Raspberry",calories:132,protein:14.2,carbs:17,fat:13.2,serving:"1 serving",category:"Food",image:foodImage(116,"Raspberry")},
{id:117,name:"Blackberry",calories:264,protein:15.4,carbs:29,fat:14.4,serving:"1 serving",category:"Food",image:foodImage(117,"Blackberry")},
{id:118,name:"Guava",calories:128,protein:1.8,carbs:13,fat:0.8,serving:"1 serving",category:"Food",image:foodImage(118,"Guava")},
{id:119,name:"Pomegranate",calories:401,protein:11.1,carbs:46,fat:10.1,serving:"1 serving",category:"Food",image:foodImage(119,"Pomegranate")},
{id:120,name:"Kiwi",calories:157,protein:10.7,carbs:42,fat:9.7,serving:"1 serving",category:"Food",image:foodImage(120,"Kiwi")},
{id:121,name:"Pear",calories:238,protein:6.8,carbs:63,fat:5.8,serving:"1 serving",category:"Food",image:foodImage(121,"Pear")},
{id:122,name:"Peach",calories:98,protein:16.8,carbs:43,fat:15.8,serving:"1 serving",category:"Food",image:foodImage(122,"Peach")},
{id:123,name:"Plum",calories:49,protein:15.9,carbs:34,fat:14.9,serving:"1 serving",category:"Food",image:foodImage(123,"Plum")},
{id:124,name:"Apricot",calories:216,protein:16.6,carbs:41,fat:15.6,serving:"1 serving",category:"Food",image:foodImage(124,"Apricot")},
{id:125,name:"Cherries",calories:348,protein:5.8,carbs:53,fat:4.8,serving:"1 serving",category:"Food",image:foodImage(125,"Cherries")},
{id:126,name:"Dragon Fruit",calories:370,protein:10.0,carbs:35,fat:9.0,serving:"1 serving",category:"Food",image:foodImage(126,"Dragon Fruit")},
{id:127,name:"Passion Fruit",calories:480,protein:17.0,carbs:45,fat:16.0,serving:"1 serving",category:"Food",image:foodImage(127,"Passion Fruit")},
{id:128,name:"Jackfruit",calories:373,protein:4.3,carbs:38,fat:3.3,serving:"1 serving",category:"Food",image:foodImage(128,"Jackfruit")},
{id:129,name:"Custard Apple",calories:110,protein:14.0,carbs:15,fat:13.0,serving:"1 serving",category:"Food",image:foodImage(129,"Custard Apple")},
{id:130,name:"Sapota",calories:430,protein:12.0,carbs:55,fat:11.0,serving:"1 serving",category:"Food",image:foodImage(130,"Sapota")},
{id:131,name:"Lychee",calories:280,protein:9.0,carbs:25,fat:8.0,serving:"1 serving",category:"Food",image:foodImage(131,"Lychee")},
{id:132,name:"Fig",calories:326,protein:1.6,carbs:11,fat:0.6,serving:"1 serving",category:"Food",image:foodImage(132,"Fig")},
{id:133,name:"Dates",calories:352,protein:18.2,carbs:57,fat:17.2,serving:"1 serving",category:"Food",image:foodImage(133,"Dates")},
{id:134,name:"Coconut",calories:243,protein:11.3,carbs:48,fat:10.3,serving:"1 serving",category:"Food",image:foodImage(134,"Coconut")},
{id:135,name:"Avocado",calories:300,protein:9.0,carbs:25,fat:8.0,serving:"1 serving",category:"Food",image:foodImage(135,"Avocado")},
{id:136,name:"Carrot",calories:359,protein:16.9,carbs:44,fat:15.9,serving:"1 serving",category:"Food",image:foodImage(136,"Carrot")},
{id:137,name:"Beetroot",calories:361,protein:13.1,carbs:6,fat:12.1,serving:"1 serving",category:"Food",image:foodImage(137,"Beetroot")},
{id:138,name:"Potato",calories:71,protein:12.1,carbs:56,fat:11.1,serving:"1 serving",category:"Food",image:foodImage(138,"Potato")},
{id:139,name:"Sweet Potato",calories:249,protein:1.9,carbs:14,fat:0.9,serving:"1 serving",category:"Food",image:foodImage(139,"Sweet Potato")},
{id:140,name:"Tomato",calories:183,protein:15.3,carbs:28,fat:14.3,serving:"1 serving",category:"Food",image:foodImage(140,"Tomato")},
{id:141,name:"Onion",calories:417,protein:6.7,carbs:62,fat:5.7,serving:"1 serving",category:"Food",image:foodImage(141,"Onion")},
{id:142,name:"Cucumber",calories:409,protein:15.9,carbs:34,fat:14.9,serving:"1 serving",category:"Food",image:foodImage(142,"Cucumber")},
{id:143,name:"Spinach",calories:464,protein:11.4,carbs:49,fat:10.4,serving:"1 serving",category:"Food",image:foodImage(143,"Spinach")},
{id:144,name:"Broccoli",calories:86,protein:9.6,carbs:31,fat:8.6,serving:"1 serving",category:"Food",image:foodImage(144,"Broccoli")},
{id:145,name:"Cauliflower",calories:216,protein:18.6,carbs:61,fat:17.6,serving:"1 serving",category:"Food",image:foodImage(145,"Cauliflower")},
{id:146,name:"Cabbage",calories:75,protein:2.5,carbs:20,fat:1.5,serving:"1 serving",category:"Food",image:foodImage(146,"Cabbage")},
{id:147,name:"Capsicum",calories:126,protein:13.6,carbs:11,fat:12.6,serving:"1 serving",category:"Food",image:foodImage(147,"Capsicum")},
{id:148,name:"Green Beans",calories:92,protein:14.2,carbs:17,fat:13.2,serving:"1 serving",category:"Food",image:foodImage(148,"Green Beans")},
{id:149,name:"Peas",calories:326,protein:9.6,carbs:31,fat:8.6,serving:"1 serving",category:"Food",image:foodImage(149,"Peas")},
{id:150,name:"Corn",calories:230,protein:10.0,carbs:35,fat:9.0,serving:"1 serving",category:"Food",image:foodImage(150,"Corn")},
{id:151,name:"Mushroom",calories:60,protein:13.0,carbs:5,fat:12.0,serving:"1 serving",category:"Food",image:foodImage(151,"Mushroom")},
{id:152,name:"Brinjal",calories:372,protein:4.2,carbs:37,fat:3.2,serving:"1 serving",category:"Food",image:foodImage(152,"Brinjal")},
{id:153,name:"Bottle Gourd",calories:495,protein:18.5,carbs:60,fat:17.5,serving:"1 serving",category:"Food",image:foodImage(153,"Bottle Gourd")},
{id:154,name:"Bitter Gourd",calories:82,protein:13.2,carbs:7,fat:12.2,serving:"1 serving",category:"Food",image:foodImage(154,"Bitter Gourd")},
{id:155,name:"Ridge Gourd",calories:213,protein:10.3,carbs:38,fat:9.3,serving:"1 serving",category:"Food",image:foodImage(155,"Ridge Gourd")},
{id:156,name:"Snake Gourd",calories:129,protein:7.9,carbs:14,fat:6.9,serving:"1 serving",category:"Food",image:foodImage(156,"Snake Gourd")},
{id:157,name:"Drumstick",calories:84,protein:7.4,carbs:9,fat:6.4,serving:"1 serving",category:"Food",image:foodImage(157,"Drumstick")},
{id:158,name:"Pumpkin",calories:422,protein:17.2,carbs:47,fat:16.2,serving:"1 serving",category:"Food",image:foodImage(158,"Pumpkin")},
{id:159,name:"Radish",calories:233,protein:14.3,carbs:18,fat:13.3,serving:"1 serving",category:"Food",image:foodImage(159,"Radish")},
{id:160,name:"Turnip",calories:216,protein:12.6,carbs:61,fat:11.6,serving:"1 serving",category:"Food",image:foodImage(160,"Turnip")},
{id:161,name:"Okra",calories:147,protein:9.7,carbs:32,fat:8.7,serving:"1 serving",category:"Food",image:foodImage(161,"Okra")},
{id:162,name:"Zucchini",calories:184,protein:1.4,carbs:9,fat:0.4,serving:"1 serving",category:"Food",image:foodImage(162,"Zucchini")},
{id:163,name:"Lettuce",calories:41,protein:9.1,carbs:26,fat:8.1,serving:"1 serving",category:"Food",image:foodImage(163,"Lettuce")},
{id:164,name:"Celery",calories:192,protein:8.2,carbs:17,fat:7.2,serving:"1 serving",category:"Food",image:foodImage(164,"Celery")},
{id:165,name:"Garlic",calories:135,protein:14.5,carbs:20,fat:13.5,serving:"1 serving",category:"Food",image:foodImage(165,"Garlic")},
{id:166,name:"Ginger",calories:241,protein:3.1,carbs:26,fat:2.1,serving:"1 serving",category:"Food",image:foodImage(166,"Ginger")},
{id:167,name:"Green Salad",calories:245,protein:1.5,carbs:10,fat:0.5,serving:"1 serving",category:"Food",image:foodImage(167,"Green Salad")},
{id:168,name:"Cucumber Salad",calories:169,protein:9.9,carbs:34,fat:8.9,serving:"1 serving",category:"Food",image:foodImage(168,"Cucumber Salad")},
{id:169,name:"Tomato Salad",calories:101,protein:7.1,carbs:6,fat:6.1,serving:"1 serving",category:"Food",image:foodImage(169,"Tomato Salad")},
{id:170,name:"Sprout Salad",calories:50,protein:18.0,carbs:55,fat:17.0,serving:"1 serving",category:"Food",image:foodImage(170,"Sprout Salad")},
{id:171,name:"Fruit Salad",calories:372,protein:14.2,carbs:17,fat:13.2,serving:"1 serving",category:"Food",image:foodImage(171,"Fruit Salad")},
{id:172,name:"Greek Salad",calories:93,protein:6.3,carbs:58,fat:5.3,serving:"1 serving",category:"Food",image:foodImage(172,"Greek Salad")},
{id:173,name:"Chicken Salad",calories:208,protein:13.8,carbs:13,fat:12.8,serving:"1 serving",category:"Food",image:foodImage(173,"Chicken Salad")},
{id:174,name:"Tuna Salad",calories:200,protein:13.0,carbs:5,fat:12.0,serving:"1 serving",category:"Food",image:foodImage(174,"Tuna Salad")},
{id:175,name:"Paneer Salad",calories:292,protein:8.2,carbs:17,fat:7.2,serving:"1 serving",category:"Food",image:foodImage(175,"Paneer Salad")},
{id:176,name:"Chickpea Salad",calories:346,protein:9.6,carbs:31,fat:8.6,serving:"1 serving",category:"Food",image:foodImage(176,"Chickpea Salad")},
{id:177,name:"Corn Salad",calories:98,protein:10.8,carbs:43,fat:9.8,serving:"1 serving",category:"Food",image:foodImage(177,"Corn Salad")},
{id:178,name:"Beetroot Salad",calories:105,protein:3.5,carbs:30,fat:2.5,serving:"1 serving",category:"Food",image:foodImage(178,"Beetroot Salad")},
{id:179,name:"Tomato Soup",calories:200,protein:3.0,carbs:25,fat:2.0,serving:"1 serving",category:"Food",image:foodImage(179,"Tomato Soup")},
{id:180,name:"Vegetable Soup",calories:146,protein:13.6,carbs:11,fat:12.6,serving:"1 serving",category:"Food",image:foodImage(180,"Vegetable Soup")},
{id:181,name:"Chicken Soup",calories:285,protein:1.5,carbs:10,fat:0.5,serving:"1 serving",category:"Food",image:foodImage(181,"Chicken Soup")},
{id:182,name:"Sweet Corn Soup",calories:200,protein:9.0,carbs:25,fat:8.0,serving:"1 serving",category:"Food",image:foodImage(182,"Sweet Corn Soup")},
{id:183,name:"Hot and Sour Soup",calories:366,protein:3.6,carbs:31,fat:2.6,serving:"1 serving",category:"Food",image:foodImage(183,"Hot and Sour Soup")},
{id:184,name:"Manchow Soup",calories:81,protein:5.1,carbs:46,fat:4.1,serving:"1 serving",category:"Food",image:foodImage(184,"Manchow Soup")},
{id:185,name:"Mushroom Soup",calories:266,protein:17.6,carbs:51,fat:16.6,serving:"1 serving",category:"Food",image:foodImage(185,"Mushroom Soup")},
{id:186,name:"Lentil Soup",calories:156,protein:16.6,carbs:41,fat:15.6,serving:"1 serving",category:"Food",image:foodImage(186,"Lentil Soup")},
{id:187,name:"Spinach Soup",calories:383,protein:3.3,carbs:28,fat:2.3,serving:"1 serving",category:"Food",image:foodImage(187,"Spinach Soup")},
{id:188,name:"Pumpkin Soup",calories:495,protein:10.5,carbs:40,fat:9.5,serving:"1 serving",category:"Food",image:foodImage(188,"Pumpkin Soup")},
{id:189,name:"Carrot Soup",calories:335,protein:4.5,carbs:40,fat:3.5,serving:"1 serving",category:"Food",image:foodImage(189,"Carrot Soup")},
{id:190,name:"Broccoli Soup",calories:170,protein:6.0,carbs:55,fat:5.0,serving:"1 serving",category:"Food",image:foodImage(190,"Broccoli Soup")},
{id:191,name:"Minestrone",calories:252,protein:2.2,carbs:17,fat:1.2,serving:"1 serving",category:"Food",image:foodImage(191,"Minestrone")},
{id:192,name:"Clear Soup",calories:361,protein:17.1,carbs:46,fat:16.1,serving:"1 serving",category:"Food",image:foodImage(192,"Clear Soup")},
{id:193,name:"Popcorn",calories:426,protein:17.6,carbs:51,fat:16.6,serving:"1 serving",category:"Food",image:foodImage(193,"Popcorn")},
{id:194,name:"Roasted Makhana",calories:112,protein:2.2,carbs:17,fat:1.2,serving:"1 serving",category:"Food",image:foodImage(194,"Roasted Makhana")},
{id:195,name:"Roasted Chickpeas",calories:161,protein:11.1,carbs:46,fat:10.1,serving:"1 serving",category:"Food",image:foodImage(195,"Roasted Chickpeas")},
{id:196,name:"Peanut Chaat",calories:87,protein:11.7,carbs:52,fat:10.7,serving:"1 serving",category:"Food",image:foodImage(196,"Peanut Chaat")},
{id:197,name:"Corn Chaat",calories:261,protein:15.1,carbs:26,fat:14.1,serving:"1 serving",category:"Food",image:foodImage(197,"Corn Chaat")},
{id:198,name:"Fruit Chaat",calories:51,protein:8.1,carbs:16,fat:7.1,serving:"1 serving",category:"Food",image:foodImage(198,"Fruit Chaat")},
{id:199,name:"Trail Mix",calories:268,protein:9.8,carbs:33,fat:8.8,serving:"1 serving",category:"Food",image:foodImage(199,"Trail Mix")},
{id:200,name:"Rice Cakes",calories:323,protein:1.3,carbs:8,fat:0.3,serving:"1 serving",category:"Food",image:foodImage(200,"Rice Cakes")},
{id:201,name:"Hummus",calories:124,protein:1.4,carbs:9,fat:0.4,serving:"1 serving",category:"Food",image:foodImage(201,"Hummus")},
{id:202,name:"Peanut Butter",calories:468,protein:5.8,carbs:53,fat:4.8,serving:"1 serving",category:"Food",image:foodImage(202,"Peanut Butter")},
{id:203,name:"Almond Butter",calories:198,protein:10.8,carbs:43,fat:9.8,serving:"1 serving",category:"Food",image:foodImage(203,"Almond Butter")},
{id:204,name:"Cheese Cubes",calories:224,protein:11.4,carbs:49,fat:10.4,serving:"1 serving",category:"Food",image:foodImage(204,"Cheese Cubes")},
{id:205,name:"Yogurt Bowl",calories:478,protein:8.8,carbs:23,fat:7.8,serving:"1 serving",category:"Food",image:foodImage(205,"Yogurt Bowl")},
{id:206,name:"Granola Bar",calories:445,protein:5.5,carbs:50,fat:4.5,serving:"1 serving",category:"Food",image:foodImage(206,"Granola Bar")},
{id:207,name:"Protein Bar",calories:90,protein:6.0,carbs:55,fat:5.0,serving:"1 serving",category:"Food",image:foodImage(207,"Protein Bar")},
{id:208,name:"Dark Chocolate",calories:435,protein:16.5,carbs:40,fat:15.5,serving:"1 serving",category:"Food",image:foodImage(208,"Dark Chocolate")},
{id:209,name:"Milk Chocolate",calories:148,protein:1.8,carbs:13,fat:0.8,serving:"1 serving",category:"Drinks",image:foodImage(209,"Milk Chocolate")},
{id:210,name:"Baked Chips",calories:169,protein:11.9,carbs:54,fat:10.9,serving:"1 serving",category:"Food",image:foodImage(210,"Baked Chips")},
{id:211,name:"Potato Chips",calories:206,protein:1.6,carbs:11,fat:0.6,serving:"1 serving",category:"Food",image:foodImage(211,"Potato Chips")},
{id:212,name:"Nachos",calories:389,protein:7.9,carbs:14,fat:6.9,serving:"1 serving",category:"Food",image:foodImage(212,"Nachos")},
{id:213,name:"Pretzels",calories:438,protein:18.8,carbs:63,fat:17.8,serving:"1 serving",category:"Food",image:foodImage(213,"Pretzels")},
{id:214,name:"Crackers",calories:245,protein:5.5,carbs:50,fat:4.5,serving:"1 serving",category:"Food",image:foodImage(214,"Crackers")},
{id:215,name:"Roasted Peanuts",calories:378,protein:18.8,carbs:63,fat:17.8,serving:"1 serving",category:"Food",image:foodImage(215,"Roasted Peanuts")},
{id:216,name:"Roasted Almonds",calories:485,protein:15.5,carbs:30,fat:14.5,serving:"1 serving",category:"Food",image:foodImage(216,"Roasted Almonds")},
{id:217,name:"Roasted Cashews",calories:370,protein:2.0,carbs:15,fat:1.0,serving:"1 serving",category:"Food",image:foodImage(217,"Roasted Cashews")},
{id:218,name:"Mixed Nuts",calories:153,protein:16.3,carbs:38,fat:15.3,serving:"1 serving",category:"Food",image:foodImage(218,"Mixed Nuts")},
{id:219,name:"Gulab Jamun",calories:327,protein:9.7,carbs:32,fat:8.7,serving:"1 serving",category:"Food",image:foodImage(219,"Gulab Jamun")},
{id:220,name:"Rasgulla",calories:308,protein:1.8,carbs:13,fat:0.8,serving:"1 serving",category:"Food",image:foodImage(220,"Rasgulla")},
{id:221,name:"Jalebi",calories:56,protein:10.6,carbs:41,fat:9.6,serving:"1 serving",category:"Food",image:foodImage(221,"Jalebi")},
{id:222,name:"Kheer",calories:238,protein:10.8,carbs:43,fat:9.8,serving:"1 serving",category:"Food",image:foodImage(222,"Kheer")},
{id:223,name:"Payasam",calories:499,protein:18.9,carbs:64,fat:17.9,serving:"1 serving",category:"Food",image:foodImage(223,"Payasam")},
{id:224,name:"Gajar Halwa",calories:250,protein:10.0,carbs:35,fat:9.0,serving:"1 serving",category:"Food",image:foodImage(224,"Gajar Halwa")},
{id:225,name:"Kulfi",calories:287,protein:13.7,carbs:12,fat:12.7,serving:"1 serving",category:"Food",image:foodImage(225,"Kulfi")},
{id:226,name:"Ice Cream",calories:382,protein:3.2,carbs:27,fat:2.2,serving:"1 serving",category:"Food",image:foodImage(226,"Ice Cream")},
{id:227,name:"Vanilla Ice Cream",calories:197,protein:8.7,carbs:22,fat:7.7,serving:"1 serving",category:"Food",image:foodImage(227,"Vanilla Ice Cream")},
{id:228,name:"Chocolate Ice Cream",calories:334,protein:16.4,carbs:39,fat:15.4,serving:"1 serving",category:"Food",image:foodImage(228,"Chocolate Ice Cream")},
{id:229,name:"Mango Ice Cream",calories:168,protein:7.8,carbs:13,fat:6.8,serving:"1 serving",category:"Food",image:foodImage(229,"Mango Ice Cream")},
{id:230,name:"Strawberry Ice Cream",calories:367,protein:11.7,carbs:52,fat:10.7,serving:"1 serving",category:"Food",image:foodImage(230,"Strawberry Ice Cream")},
{id:231,name:"Brownie",calories:51,protein:16.1,carbs:36,fat:15.1,serving:"1 serving",category:"Food",image:foodImage(231,"Brownie")},
{id:232,name:"Chocolate Cake",calories:65,protein:17.5,carbs:50,fat:16.5,serving:"1 serving",category:"Food",image:foodImage(232,"Chocolate Cake")},
{id:233,name:"Vanilla Cake",calories:231,protein:8.1,carbs:16,fat:7.1,serving:"1 serving",category:"Food",image:foodImage(233,"Vanilla Cake")},
{id:234,name:"Cheesecake",calories:483,protein:15.3,carbs:28,fat:14.3,serving:"1 serving",category:"Food",image:foodImage(234,"Cheesecake")},
{id:235,name:"Carrot Cake",calories:234,protein:12.4,carbs:59,fat:11.4,serving:"1 serving",category:"Food",image:foodImage(235,"Carrot Cake")},
{id:236,name:"Apple Pie",calories:120,protein:1.0,carbs:5,fat:0.0,serving:"1 serving",category:"Food",image:foodImage(236,"Apple Pie")},
{id:237,name:"Fruit Custard",calories:100,protein:9.0,carbs:25,fat:8.0,serving:"1 serving",category:"Food",image:foodImage(237,"Fruit Custard")},
{id:238,name:"Pudding",calories:117,protein:8.7,carbs:22,fat:7.7,serving:"1 serving",category:"Food",image:foodImage(238,"Pudding")},
{id:239,name:"Mousse",calories:270,protein:4.0,carbs:35,fat:3.0,serving:"1 serving",category:"Food",image:foodImage(239,"Mousse")},
{id:240,name:"Tiramisu",calories:275,protein:10.5,carbs:40,fat:9.5,serving:"1 serving",category:"Food",image:foodImage(240,"Tiramisu")},
{id:241,name:"Donut",calories:75,protein:8.5,carbs:20,fat:7.5,serving:"1 serving",category:"Food",image:foodImage(241,"Donut")},
{id:242,name:"Muffin",calories:354,protein:8.4,carbs:19,fat:7.4,serving:"1 serving",category:"Food",image:foodImage(242,"Muffin")},
{id:243,name:"Cupcake",calories:367,protein:3.7,carbs:32,fat:2.7,serving:"1 serving",category:"Food",image:foodImage(243,"Cupcake")},
{id:244,name:"Cookies",calories:357,protein:14.7,carbs:22,fat:13.7,serving:"1 serving",category:"Food",image:foodImage(244,"Cookies")},
{id:245,name:"Ladoo",calories:273,protein:12.3,carbs:58,fat:11.3,serving:"1 serving",category:"Food",image:foodImage(245,"Ladoo")},
{id:246,name:"Barfi",calories:44,protein:17.4,carbs:49,fat:16.4,serving:"1 serving",category:"Food",image:foodImage(246,"Barfi")},
{id:247,name:"Kaju Katli",calories:488,protein:7.8,carbs:13,fat:6.8,serving:"1 serving",category:"Food",image:foodImage(247,"Kaju Katli")},
{id:248,name:"Mysore Pak",calories:126,protein:1.6,carbs:11,fat:0.6,serving:"1 serving",category:"Food",image:foodImage(248,"Mysore Pak")},
{id:249,name:"Soan Papdi",calories:488,protein:9.8,carbs:33,fat:8.8,serving:"1 serving",category:"Food",image:foodImage(249,"Soan Papdi")},
{id:250,name:"Tea",calories:289,protein:1.9,carbs:14,fat:0.9,serving:"1 serving",category:"Drinks",image:foodImage(250,"Tea")},
{id:251,name:"Coffee",calories:316,protein:18.6,carbs:61,fat:17.6,serving:"1 serving",category:"Drinks",image:foodImage(251,"Coffee")},
{id:252,name:"Black Tea",calories:438,protein:16.8,carbs:43,fat:15.8,serving:"1 serving",category:"Drinks",image:foodImage(252,"Black Tea")},
{id:253,name:"Green Tea",calories:67,protein:1.7,carbs:12,fat:0.7,serving:"1 serving",category:"Drinks",image:foodImage(253,"Green Tea")},
{id:254,name:"Masala Tea",calories:301,protein:13.1,carbs:6,fat:12.1,serving:"1 serving",category:"Drinks",image:foodImage(254,"Masala Tea")},
{id:255,name:"Ginger Tea",calories:90,protein:18.0,carbs:55,fat:17.0,serving:"1 serving",category:"Drinks",image:foodImage(255,"Ginger Tea")},
{id:256,name:"Lemon Tea",calories:135,protein:4.5,carbs:40,fat:3.5,serving:"1 serving",category:"Drinks",image:foodImage(256,"Lemon Tea")},
{id:257,name:"Iced Tea",calories:264,protein:13.4,carbs:9,fat:12.4,serving:"1 serving",category:"Drinks",image:foodImage(257,"Iced Tea")},
{id:258,name:"Black Coffee",calories:371,protein:16.1,carbs:36,fat:15.1,serving:"1 serving",category:"Drinks",image:foodImage(258,"Black Coffee")},
{id:259,name:"Cold Coffee",calories:388,protein:15.8,carbs:33,fat:14.8,serving:"1 serving",category:"Drinks",image:foodImage(259,"Cold Coffee")},
{id:260,name:"Cappuccino",calories:208,protein:3.8,carbs:33,fat:2.8,serving:"1 serving",category:"Drinks",image:foodImage(260,"Cappuccino")},
{id:261,name:"Latte",calories:41,protein:11.1,carbs:46,fat:10.1,serving:"1 serving",category:"Drinks",image:foodImage(261,"Latte")},
{id:262,name:"Espresso",calories:439,protein:18.9,carbs:64,fat:17.9,serving:"1 serving",category:"Drinks",image:foodImage(262,"Espresso")},
{id:263,name:"Americano",calories:75,protein:4.5,carbs:40,fat:3.5,serving:"1 serving",category:"Food",image:foodImage(263,"Americano")},
{id:264,name:"Mocha",calories:462,protein:11.2,carbs:47,fat:10.2,serving:"1 serving",category:"Drinks",image:foodImage(264,"Mocha")},
{id:265,name:"Hot Chocolate",calories:226,protein:7.6,carbs:11,fat:6.6,serving:"1 serving",category:"Drinks",image:foodImage(265,"Hot Chocolate")},
{id:266,name:"Milk",calories:83,protein:13.3,carbs:8,fat:12.3,serving:"1 serving",category:"Drinks",image:foodImage(266,"Milk")},
{id:267,name:"Chocolate Milk",calories:386,protein:17.6,carbs:51,fat:16.6,serving:"1 serving",category:"Drinks",image:foodImage(267,"Chocolate Milk")},
{id:268,name:"Buttermilk",calories:428,protein:13.8,carbs:13,fat:12.8,serving:"1 serving",category:"Drinks",image:foodImage(268,"Buttermilk")},
{id:269,name:"Lassi",calories:94,protein:14.4,carbs:19,fat:13.4,serving:"1 serving",category:"Drinks",image:foodImage(269,"Lassi")},
{id:270,name:"Mango Lassi",calories:69,protein:13.9,carbs:14,fat:12.9,serving:"1 serving",category:"Drinks",image:foodImage(270,"Mango Lassi")},
{id:271,name:"Sweet Lassi",calories:287,protein:17.7,carbs:52,fat:16.7,serving:"1 serving",category:"Drinks",image:foodImage(271,"Sweet Lassi")},
{id:272,name:"Salted Lassi",calories:492,protein:2.2,carbs:17,fat:1.2,serving:"1 serving",category:"Drinks",image:foodImage(272,"Salted Lassi")},
{id:273,name:"Coconut Water",calories:353,protein:2.3,carbs:18,fat:1.3,serving:"1 serving",category:"Drinks",image:foodImage(273,"Coconut Water")},
{id:274,name:"Orange Juice",calories:428,protein:3.8,carbs:33,fat:2.8,serving:"1 serving",category:"Drinks",image:foodImage(274,"Orange Juice")},
{id:275,name:"Apple Juice",calories:177,protein:4.7,carbs:42,fat:3.7,serving:"1 serving",category:"Drinks",image:foodImage(275,"Apple Juice")},
{id:276,name:"Mango Juice",calories:450,protein:18.0,carbs:55,fat:17.0,serving:"1 serving",category:"Drinks",image:foodImage(276,"Mango Juice")},
{id:277,name:"Pineapple Juice",calories:447,protein:17.7,carbs:52,fat:16.7,serving:"1 serving",category:"Drinks",image:foodImage(277,"Pineapple Juice")},
{id:278,name:"Watermelon Juice",calories:179,protein:14.9,carbs:24,fat:13.9,serving:"1 serving",category:"Drinks",image:foodImage(278,"Watermelon Juice")},
{id:279,name:"Grape Juice",calories:265,protein:17.5,carbs:50,fat:16.5,serving:"1 serving",category:"Drinks",image:foodImage(279,"Grape Juice")},
{id:280,name:"Lemon Juice",calories:487,protein:1.7,carbs:12,fat:0.7,serving:"1 serving",category:"Drinks",image:foodImage(280,"Lemon Juice")},
{id:281,name:"Carrot Juice",calories:165,protein:5.5,carbs:50,fat:4.5,serving:"1 serving",category:"Drinks",image:foodImage(281,"Carrot Juice")},
{id:282,name:"Beetroot Juice",calories:181,protein:7.1,carbs:6,fat:6.1,serving:"1 serving",category:"Drinks",image:foodImage(282,"Beetroot Juice")},
{id:283,name:"Pomegranate Juice",calories:67,protein:9.7,carbs:32,fat:8.7,serving:"1 serving",category:"Drinks",image:foodImage(283,"Pomegranate Juice")},
{id:284,name:"Mixed Fruit Juice",calories:353,protein:4.3,carbs:38,fat:3.3,serving:"1 serving",category:"Drinks",image:foodImage(284,"Mixed Fruit Juice")},
{id:285,name:"Smoothie",calories:143,protein:17.3,carbs:48,fat:16.3,serving:"1 serving",category:"Drinks",image:foodImage(285,"Smoothie")},
{id:286,name:"Banana Smoothie",calories:139,protein:16.9,carbs:44,fat:15.9,serving:"1 serving",category:"Drinks",image:foodImage(286,"Banana Smoothie")},
{id:287,name:"Mango Smoothie",calories:446,protein:1.6,carbs:11,fat:0.6,serving:"1 serving",category:"Drinks",image:foodImage(287,"Mango Smoothie")},
{id:288,name:"Berry Smoothie",calories:202,protein:9.2,carbs:27,fat:8.2,serving:"1 serving",category:"Drinks",image:foodImage(288,"Berry Smoothie")},
{id:289,name:"Strawberry Smoothie",calories:489,protein:3.9,carbs:34,fat:2.9,serving:"1 serving",category:"Drinks",image:foodImage(289,"Strawberry Smoothie")},
{id:290,name:"Protein Smoothie",calories:130,protein:10.0,carbs:35,fat:9.0,serving:"1 serving",category:"Drinks",image:foodImage(290,"Protein Smoothie")},
{id:291,name:"Milkshake",calories:417,protein:4.7,carbs:42,fat:3.7,serving:"1 serving",category:"Drinks",image:foodImage(291,"Milkshake")},
{id:292,name:"Chocolate Milkshake",calories:429,protein:9.9,carbs:34,fat:8.9,serving:"1 serving",category:"Drinks",image:foodImage(292,"Chocolate Milkshake")},
{id:293,name:"Vanilla Milkshake",calories:126,protein:11.6,carbs:51,fat:10.6,serving:"1 serving",category:"Drinks",image:foodImage(293,"Vanilla Milkshake")},
{id:294,name:"Mango Milkshake",calories:274,protein:16.4,carbs:39,fat:15.4,serving:"1 serving",category:"Drinks",image:foodImage(294,"Mango Milkshake")},
{id:295,name:"Almond Milk",calories:346,protein:15.6,carbs:31,fat:14.6,serving:"1 serving",category:"Drinks",image:foodImage(295,"Almond Milk")},
{id:296,name:"Soy Milk",calories:119,protein:18.9,carbs:64,fat:17.9,serving:"1 serving",category:"Drinks",image:foodImage(296,"Soy Milk")},
{id:297,name:"Oat Milk",calories:487,protein:5.7,carbs:52,fat:4.7,serving:"1 serving",category:"Drinks",image:foodImage(297,"Oat Milk")},
{id:298,name:"Brown Rice",calories:199,protein:4.9,carbs:44,fat:3.9,serving:"1 serving",category:"Food",image:foodImage(298,"Brown Rice")},
{id:299,name:"Basmati Rice",calories:364,protein:3.4,carbs:29,fat:2.4,serving:"1 serving",category:"Food",image:foodImage(299,"Basmati Rice")},
{id:300,name:"Quinoa",calories:85,protein:9.5,carbs:30,fat:8.5,serving:"1 serving",category:"Food",image:foodImage(300,"Quinoa")},
{id:301,name:"Oats",calories:384,protein:1.4,carbs:9,fat:0.4,serving:"1 serving",category:"Food",image:foodImage(301,"Oats")},
{id:302,name:"Rolled Oats",calories:470,protein:2.0,carbs:15,fat:1.0,serving:"1 serving",category:"Food",image:foodImage(302,"Rolled Oats")},
{id:303,name:"Millet",calories:211,protein:14.1,carbs:16,fat:13.1,serving:"1 serving",category:"Food",image:foodImage(303,"Millet")},
{id:304,name:"Foxtail Millet",calories:284,protein:17.4,carbs:49,fat:16.4,serving:"1 serving",category:"Food",image:foodImage(304,"Foxtail Millet")},
{id:305,name:"Little Millet",calories:289,protein:5.9,carbs:54,fat:4.9,serving:"1 serving",category:"Food",image:foodImage(305,"Little Millet")},
{id:306,name:"Pearl Millet",calories:300,protein:17.0,carbs:45,fat:16.0,serving:"1 serving",category:"Food",image:foodImage(306,"Pearl Millet")},
{id:307,name:"Finger Millet",calories:424,protein:9.4,carbs:29,fat:8.4,serving:"1 serving",category:"Food",image:foodImage(307,"Finger Millet")},
{id:308,name:"Barnyard Millet",calories:268,protein:9.8,carbs:33,fat:8.8,serving:"1 serving",category:"Food",image:foodImage(308,"Barnyard Millet")},
{id:309,name:"Kodo Millet",calories:106,protein:1.6,carbs:11,fat:0.6,serving:"1 serving",category:"Food",image:foodImage(309,"Kodo Millet")},
{id:310,name:"Barley",calories:257,protein:14.7,carbs:22,fat:13.7,serving:"1 serving",category:"Food",image:foodImage(310,"Barley")},
{id:311,name:"Couscous",calories:312,protein:14.2,carbs:17,fat:13.2,serving:"1 serving",category:"Food",image:foodImage(311,"Couscous")},
{id:312,name:"Bulgur",calories:139,protein:4.9,carbs:44,fat:3.9,serving:"1 serving",category:"Food",image:foodImage(312,"Bulgur")},
{id:313,name:"Whole Wheat Pasta",calories:363,protein:1.3,carbs:8,fat:0.3,serving:"1 serving",category:"Food",image:foodImage(313,"Whole Wheat Pasta")},
{id:314,name:"Pasta",calories:148,protein:3.8,carbs:33,fat:2.8,serving:"1 serving",category:"Food",image:foodImage(314,"Pasta")},
{id:315,name:"Macaroni",calories:467,protein:15.7,carbs:32,fat:14.7,serving:"1 serving",category:"Food",image:foodImage(315,"Macaroni")},
{id:316,name:"Spaghetti",calories:230,protein:18.0,carbs:55,fat:17.0,serving:"1 serving",category:"Food",image:foodImage(316,"Spaghetti")},
{id:317,name:"Vermicelli",calories:367,protein:5.7,carbs:52,fat:4.7,serving:"1 serving",category:"Food",image:foodImage(317,"Vermicelli")},
{id:318,name:"Rice Noodles",calories:100,protein:7.0,carbs:5,fat:6.0,serving:"1 serving",category:"Food",image:foodImage(318,"Rice Noodles")},
{id:319,name:"Soba Noodles",calories:271,protein:2.1,carbs:16,fat:1.1,serving:"1 serving",category:"Food",image:foodImage(319,"Soba Noodles")},
{id:320,name:"Udon Noodles",calories:291,protein:6.1,carbs:56,fat:5.1,serving:"1 serving",category:"Food",image:foodImage(320,"Udon Noodles")},
{id:321,name:"Bread",calories:410,protein:6.0,carbs:55,fat:5.0,serving:"1 serving",category:"Food",image:foodImage(321,"Bread")},
{id:322,name:"Whole Wheat Bread",calories:74,protein:8.4,carbs:19,fat:7.4,serving:"1 serving",category:"Food",image:foodImage(322,"Whole Wheat Bread")},
{id:323,name:"Multigrain Bread",calories:160,protein:13.0,carbs:5,fat:12.0,serving:"1 serving",category:"Food",image:foodImage(323,"Multigrain Bread")},
{id:324,name:"Sourdough Bread",calories:371,protein:4.1,carbs:36,fat:3.1,serving:"1 serving",category:"Food",image:foodImage(324,"Sourdough Bread")},
{id:325,name:"Rye Bread",calories:415,protein:10.5,carbs:40,fat:9.5,serving:"1 serving",category:"Food",image:foodImage(325,"Rye Bread")},
{id:326,name:"Bagel",calories:333,protein:6.3,carbs:58,fat:5.3,serving:"1 serving",category:"Food",image:foodImage(326,"Bagel")},
{id:327,name:"Pizza",calories:174,protein:16.4,carbs:39,fat:15.4,serving:"1 serving",category:"Food",image:foodImage(327,"Pizza")},
{id:328,name:"Margherita Pizza",calories:349,protein:7.9,carbs:14,fat:6.9,serving:"1 serving",category:"Food",image:foodImage(328,"Margherita Pizza")},
{id:329,name:"Pepperoni Pizza",calories:88,protein:9.8,carbs:33,fat:8.8,serving:"1 serving",category:"Food",image:foodImage(329,"Pepperoni Pizza")},
{id:330,name:"Chicken Pizza",calories:57,protein:10.7,carbs:42,fat:9.7,serving:"1 serving",category:"Food",image:foodImage(330,"Chicken Pizza")},
{id:331,name:"Veg Pizza",calories:41,protein:5.1,carbs:46,fat:4.1,serving:"1 serving",category:"Food",image:foodImage(331,"Veg Pizza")},
{id:332,name:"Pasta Alfredo",calories:270,protein:6.0,carbs:55,fat:5.0,serving:"1 serving",category:"Food",image:foodImage(332,"Pasta Alfredo")},
{id:333,name:"Pasta Arrabbiata",calories:271,protein:18.1,carbs:56,fat:17.1,serving:"1 serving",category:"Food",image:foodImage(333,"Pasta Arrabbiata")},
{id:334,name:"Pasta Pesto",calories:437,protein:10.7,carbs:42,fat:9.7,serving:"1 serving",category:"Food",image:foodImage(334,"Pasta Pesto")},
{id:335,name:"Spaghetti Bolognese",calories:133,protein:4.3,carbs:38,fat:3.3,serving:"1 serving",category:"Food",image:foodImage(335,"Spaghetti Bolognese")},
{id:336,name:"Lasagna",calories:244,protein:15.4,carbs:29,fat:14.4,serving:"1 serving",category:"Food",image:foodImage(336,"Lasagna")},
{id:337,name:"Mac and Cheese",calories:178,protein:18.8,carbs:63,fat:17.8,serving:"1 serving",category:"Food",image:foodImage(337,"Mac and Cheese")},
{id:338,name:"Tacos",calories:107,protein:15.7,carbs:32,fat:14.7,serving:"1 serving",category:"Food",image:foodImage(338,"Tacos")},
{id:339,name:"Chicken Tacos",calories:385,protein:11.5,carbs:50,fat:10.5,serving:"1 serving",category:"Food",image:foodImage(339,"Chicken Tacos")},
{id:340,name:"Bean Tacos",calories:111,protein:8.1,carbs:16,fat:7.1,serving:"1 serving",category:"Food",image:foodImage(340,"Bean Tacos")},
{id:341,name:"Burrito",calories:302,protein:1.2,carbs:7,fat:0.2,serving:"1 serving",category:"Food",image:foodImage(341,"Burrito")},
{id:342,name:"Chicken Burrito",calories:182,protein:15.2,carbs:27,fat:14.2,serving:"1 serving",category:"Food",image:foodImage(342,"Chicken Burrito")},
{id:343,name:"Quesadilla",calories:123,protein:11.3,carbs:48,fat:10.3,serving:"1 serving",category:"Food",image:foodImage(343,"Quesadilla")},
{id:344,name:"Falafel",calories:152,protein:14.2,carbs:17,fat:13.2,serving:"1 serving",category:"Food",image:foodImage(344,"Falafel")},
{id:345,name:"Falafel Wrap",calories:451,protein:14.1,carbs:16,fat:13.1,serving:"1 serving",category:"Food",image:foodImage(345,"Falafel Wrap")},
{id:346,name:"Shawarma",calories:185,protein:7.5,carbs:10,fat:6.5,serving:"1 serving",category:"Food",image:foodImage(346,"Shawarma")},
{id:347,name:"Chicken Shawarma",calories:394,protein:14.4,carbs:19,fat:13.4,serving:"1 serving",category:"Food",image:foodImage(347,"Chicken Shawarma")},
{id:348,name:"Hummus Plate",calories:67,protein:15.7,carbs:32,fat:14.7,serving:"1 serving",category:"Food",image:foodImage(348,"Hummus Plate")},
{id:349,name:"Sushi",calories:99,protein:2.9,carbs:24,fat:1.9,serving:"1 serving",category:"Food",image:foodImage(349,"Sushi")},
{id:350,name:"California Roll",calories:361,protein:9.1,carbs:26,fat:8.1,serving:"1 serving",category:"Food",image:foodImage(350,"California Roll")},
{id:351,name:"Salmon Sushi",calories:78,protein:16.8,carbs:43,fat:15.8,serving:"1 serving",category:"Food",image:foodImage(351,"Salmon Sushi")},
{id:352,name:"Chicken Teriyaki",calories:420,protein:1.0,carbs:5,fat:0.0,serving:"1 serving",category:"Food",image:foodImage(352,"Chicken Teriyaki")},
{id:353,name:"Fried Rice",calories:451,protein:10.1,carbs:36,fat:9.1,serving:"1 serving",category:"Food",image:foodImage(353,"Fried Rice")},
{id:354,name:"Noodles",calories:79,protein:12.9,carbs:64,fat:11.9,serving:"1 serving",category:"Food",image:foodImage(354,"Noodles")},
{id:355,name:"Ramen",calories:483,protein:9.3,carbs:28,fat:8.3,serving:"1 serving",category:"Food",image:foodImage(355,"Ramen")},
{id:356,name:"Pad Thai",calories:300,protein:17.0,carbs:45,fat:16.0,serving:"1 serving",category:"Food",image:foodImage(356,"Pad Thai")},
{id:357,name:"Thai Green Curry",calories:77,protein:4.7,carbs:42,fat:3.7,serving:"1 serving",category:"Food",image:foodImage(357,"Thai Green Curry")},
{id:358,name:"Thai Red Curry",calories:446,protein:7.6,carbs:11,fat:6.6,serving:"1 serving",category:"Food",image:foodImage(358,"Thai Red Curry")},
{id:359,name:"Spring Rolls",calories:359,protein:10.9,carbs:44,fat:9.9,serving:"1 serving",category:"Food",image:foodImage(359,"Spring Rolls")},
{id:360,name:"Dumplings",calories:314,protein:14.4,carbs:19,fat:13.4,serving:"1 serving",category:"Food",image:foodImage(360,"Dumplings")},
{id:361,name:"Gyoza",calories:85,protein:1.5,carbs:10,fat:0.5,serving:"1 serving",category:"Food",image:foodImage(361,"Gyoza")},
{id:362,name:"Burger",calories:407,protein:11.7,carbs:52,fat:10.7,serving:"1 serving",category:"Food",image:foodImage(362,"Burger")},
{id:363,name:"Chicken Burger",calories:198,protein:10.8,carbs:43,fat:9.8,serving:"1 serving",category:"Food",image:foodImage(363,"Chicken Burger")},
{id:364,name:"Veg Burger",calories:180,protein:15.0,carbs:25,fat:14.0,serving:"1 serving",category:"Food",image:foodImage(364,"Veg Burger")},
{id:365,name:"Cheeseburger",calories:371,protein:6.1,carbs:56,fat:5.1,serving:"1 serving",category:"Food",image:foodImage(365,"Cheeseburger")},
{id:366,name:"French Fries",calories:284,protein:9.4,carbs:29,fat:8.4,serving:"1 serving",category:"Food",image:foodImage(366,"French Fries")},
{id:367,name:"Onion Rings",calories:358,protein:12.8,carbs:63,fat:11.8,serving:"1 serving",category:"Food",image:foodImage(367,"Onion Rings")},
{id:368,name:"Grilled Cheese",calories:161,protein:15.1,carbs:26,fat:14.1,serving:"1 serving",category:"Food",image:foodImage(368,"Grilled Cheese")},
{id:369,name:"Hot Dog",calories:286,protein:13.6,carbs:11,fat:12.6,serving:"1 serving",category:"Food",image:foodImage(369,"Hot Dog")},
{id:370,name:"Almonds",calories:246,protein:7.6,carbs:11,fat:6.6,serving:"1 serving",category:"Food",image:foodImage(370,"Almonds")},
{id:371,name:"Cashews",calories:440,protein:11.0,carbs:45,fat:10.0,serving:"1 serving",category:"Food",image:foodImage(371,"Cashews")},
{id:372,name:"Walnuts",calories:148,protein:7.8,carbs:13,fat:6.8,serving:"1 serving",category:"Food",image:foodImage(372,"Walnuts")},
{id:373,name:"Pistachios",calories:410,protein:8.0,carbs:15,fat:7.0,serving:"1 serving",category:"Food",image:foodImage(373,"Pistachios")},
{id:374,name:"Peanuts",calories:419,protein:14.9,carbs:24,fat:13.9,serving:"1 serving",category:"Food",image:foodImage(374,"Peanuts")},
{id:375,name:"Hazelnuts",calories:454,protein:16.4,carbs:39,fat:15.4,serving:"1 serving",category:"Food",image:foodImage(375,"Hazelnuts")},
{id:376,name:"Pecans",calories:389,protein:7.9,carbs:14,fat:6.9,serving:"1 serving",category:"Food",image:foodImage(376,"Pecans")},
{id:377,name:"Brazil Nuts",calories:190,protein:4.0,carbs:35,fat:3.0,serving:"1 serving",category:"Food",image:foodImage(377,"Brazil Nuts")},
{id:378,name:"Macadamia Nuts",calories:105,protein:9.5,carbs:30,fat:8.5,serving:"1 serving",category:"Food",image:foodImage(378,"Macadamia Nuts")},
{id:379,name:"Pine Nuts",calories:444,protein:11.4,carbs:49,fat:10.4,serving:"1 serving",category:"Food",image:foodImage(379,"Pine Nuts")},
{id:380,name:"Chia Seeds",calories:330,protein:14.0,carbs:15,fat:13.0,serving:"1 serving",category:"Food",image:foodImage(380,"Chia Seeds")},
{id:381,name:"Flax Seeds",calories:311,protein:14.1,carbs:16,fat:13.1,serving:"1 serving",category:"Food",image:foodImage(381,"Flax Seeds")},
{id:382,name:"Sunflower Seeds",calories:457,protein:4.7,carbs:42,fat:3.7,serving:"1 serving",category:"Food",image:foodImage(382,"Sunflower Seeds")},
{id:383,name:"Pumpkin Seeds",calories:182,protein:15.2,carbs:27,fat:14.2,serving:"1 serving",category:"Food",image:foodImage(383,"Pumpkin Seeds")},
{id:384,name:"Sesame Seeds",calories:383,protein:13.3,carbs:8,fat:12.3,serving:"1 serving",category:"Food",image:foodImage(384,"Sesame Seeds")},
{id:385,name:"Hemp Seeds",calories:391,protein:4.1,carbs:36,fat:3.1,serving:"1 serving",category:"Food",image:foodImage(385,"Hemp Seeds")},
{id:386,name:"Mixed Seeds",calories:375,protein:10.5,carbs:40,fat:9.5,serving:"1 serving",category:"Food",image:foodImage(386,"Mixed Seeds")},
{id:387,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(387,"Idli Special")},
{id:388,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(388,"Idli Special")},
{id:389,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(389,"Idli Special")},
{id:390,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(390,"Idli Special")},
{id:391,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(391,"Idli Special")},
{id:392,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(392,"Idli Special")},
{id:393,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(393,"Idli Special")},
{id:394,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(394,"Idli Special")},
{id:395,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(395,"Idli Special")},
{id:396,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(396,"Idli Special")},
{id:397,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(397,"Idli Special")},
{id:398,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(398,"Idli Special")},
{id:399,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(399,"Idli Special")},
{id:400,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(400,"Idli Special")},
{id:401,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(401,"Idli Special")},
{id:402,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(402,"Idli Special")},
{id:403,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(403,"Idli Special")},
{id:404,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(404,"Idli Special")},
{id:405,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(405,"Idli Special")},
{id:406,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(406,"Idli Special")},
{id:407,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(407,"Idli Special")},
{id:408,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(408,"Idli Special")},
{id:409,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(409,"Idli Special")},
{id:410,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(410,"Idli Special")},
{id:411,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(411,"Idli Special")},
{id:412,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(412,"Idli Special")},
{id:413,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(413,"Idli Special")},
{id:414,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(414,"Idli Special")},
{id:415,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(415,"Idli Special")},
{id:416,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(416,"Idli Special")},
{id:417,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(417,"Idli Special")},
{id:418,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(418,"Idli Special")},
{id:419,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(419,"Idli Special")},
{id:420,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(420,"Idli Special")},
{id:421,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(421,"Idli Special")},
{id:422,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(422,"Idli Special")},
{id:423,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(423,"Idli Special")},
{id:424,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(424,"Idli Special")},
{id:425,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(425,"Idli Special")},
{id:426,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(426,"Idli Special")},
{id:427,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(427,"Idli Special")},
{id:428,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(428,"Idli Special")},
{id:429,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(429,"Idli Special")},
{id:430,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(430,"Idli Special")},
{id:431,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(431,"Idli Special")},
{id:432,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(432,"Idli Special")},
{id:433,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(433,"Idli Special")},
{id:434,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(434,"Idli Special")},
{id:435,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(435,"Idli Special")},
{id:436,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(436,"Idli Special")},
{id:437,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(437,"Idli Special")},
{id:438,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(438,"Idli Special")},
{id:439,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(439,"Idli Special")},
{id:440,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(440,"Idli Special")},
{id:441,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(441,"Idli Special")},
{id:442,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(442,"Idli Special")},
{id:443,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(443,"Idli Special")},
{id:444,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(444,"Idli Special")},
{id:445,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(445,"Idli Special")},
{id:446,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(446,"Idli Special")},
{id:447,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(447,"Idli Special")},
{id:448,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(448,"Idli Special")},
{id:449,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(449,"Idli Special")},
{id:450,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(450,"Idli Special")},
{id:451,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(451,"Idli Special")},
{id:452,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(452,"Idli Special")},
{id:453,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(453,"Idli Special")},
{id:454,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(454,"Idli Special")},
{id:455,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(455,"Idli Special")},
{id:456,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(456,"Idli Special")},
{id:457,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(457,"Idli Special")},
{id:458,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(458,"Idli Special")},
{id:459,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(459,"Idli Special")},
{id:460,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(460,"Idli Special")},
{id:461,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(461,"Idli Special")},
{id:462,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(462,"Idli Special")},
{id:463,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(463,"Idli Special")},
{id:464,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(464,"Idli Special")},
{id:465,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(465,"Idli Special")},
{id:466,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(466,"Idli Special")},
{id:467,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(467,"Idli Special")},
{id:468,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(468,"Idli Special")},
{id:469,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(469,"Idli Special")},
{id:470,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(470,"Idli Special")},
{id:471,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(471,"Idli Special")},
{id:472,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(472,"Idli Special")},
{id:473,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(473,"Idli Special")},
{id:474,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(474,"Idli Special")},
{id:475,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(475,"Idli Special")},
{id:476,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(476,"Idli Special")},
{id:477,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(477,"Idli Special")},
{id:478,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(478,"Idli Special")},
{id:479,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(479,"Idli Special")},
{id:480,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(480,"Idli Special")},
{id:481,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(481,"Idli Special")},
{id:482,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(482,"Idli Special")},
{id:483,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(483,"Idli Special")},
{id:484,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(484,"Idli Special")},
{id:485,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(485,"Idli Special")},
{id:486,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(486,"Idli Special")},
{id:487,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(487,"Idli Special")},
{id:488,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(488,"Idli Special")},
{id:489,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(489,"Idli Special")},
{id:490,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(490,"Idli Special")},
{id:491,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(491,"Idli Special")},
{id:492,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(492,"Idli Special")},
{id:493,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(493,"Idli Special")},
{id:494,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(494,"Idli Special")},
{id:495,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(495,"Idli Special")},
{id:496,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(496,"Idli Special")},
{id:497,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(497,"Idli Special")},
{id:498,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(498,"Idli Special")},
{id:499,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(499,"Idli Special")},
{id:500,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(500,"Idli Special")},
{id:501,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(501,"Idli Special")},
{id:502,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(502,"Idli Special")},
{id:503,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(503,"Idli Special")},
{id:504,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(504,"Idli Special")},
{id:505,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(505,"Idli Special")},
{id:506,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(506,"Idli Special")},
{id:507,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(507,"Idli Special")},
{id:508,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(508,"Idli Special")},
{id:509,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(509,"Idli Special")},
{id:510,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(510,"Idli Special")},
{id:511,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(511,"Idli Special")},
{id:512,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(512,"Idli Special")},
{id:513,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(513,"Idli Special")},
{id:514,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(514,"Idli Special")},
{id:515,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(515,"Idli Special")},
{id:516,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(516,"Idli Special")},
{id:517,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(517,"Idli Special")},
{id:518,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(518,"Idli Special")},
{id:519,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(519,"Idli Special")},
{id:520,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(520,"Idli Special")},
{id:521,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(521,"Idli Special")},
{id:522,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(522,"Idli Special")},
{id:523,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(523,"Idli Special")},
{id:524,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(524,"Idli Special")},
{id:525,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(525,"Idli Special")},
{id:526,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(526,"Idli Special")},
{id:527,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(527,"Idli Special")},
{id:528,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(528,"Idli Special")},
{id:529,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(529,"Idli Special")},
{id:530,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(530,"Idli Special")},
{id:531,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(531,"Idli Special")},
{id:532,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(532,"Idli Special")},
{id:533,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(533,"Idli Special")},
{id:534,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(534,"Idli Special")},
{id:535,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(535,"Idli Special")},
{id:536,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(536,"Idli Special")},
{id:537,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(537,"Idli Special")},
{id:538,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(538,"Idli Special")},
{id:539,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(539,"Idli Special")},
{id:540,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(540,"Idli Special")},
{id:541,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(541,"Idli Special")},
{id:542,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(542,"Idli Special")},
{id:543,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(543,"Idli Special")},
{id:544,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(544,"Idli Special")},
{id:545,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(545,"Idli Special")},
{id:546,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(546,"Idli Special")},
{id:547,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(547,"Idli Special")},
{id:548,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(548,"Idli Special")},
{id:549,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(549,"Idli Special")},
{id:550,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(550,"Idli Special")},
{id:551,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(551,"Idli Special")},
{id:552,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(552,"Idli Special")},
{id:553,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(553,"Idli Special")},
{id:554,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(554,"Idli Special")},
{id:555,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(555,"Idli Special")},
{id:556,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(556,"Idli Special")},
{id:557,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(557,"Idli Special")},
{id:558,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(558,"Idli Special")},
{id:559,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(559,"Idli Special")},
{id:560,name:"Idli Special",calories:334,protein:10.4,carbs:39,fat:9.4,serving:"1 serving",category:"Food",image:foodImage(560,"Idli Special")}
];
const ACTIVITIES = [
 ["Walking","photo-1551632811-561732d1e306",3.5],["Running","photo-1552674605-db6ffd4facb5",9],["Cycling","photo-1558981806-ec527fa84c39",7],["Swimming","photo-1530549387789-4c1017266635",8],
 ["Strength","photo-1581009146145-b5ef050c2e1e",6],["Badminton","photo-1626224583764-f87db24ac4ea",6],["Football","photo-1579952363873-27f3bade9f55",7],["Yoga","photo-1544367567-0f2fcb009e0b",3]
] as const;
const GOALS:[Goal,string,string,string][] = [
 ["healthy","Healthy","Balanced habits and maintenance","photo-1498837167922-ddd27525d352"],
 ["strength","Strength","Support strength and training","photo-1583454110551-21f2fa2afe61"],
 ["fitness","Fitness","Build an active routine","photo-1534438327276-14e5300c3a48"],
 ["fat-loss","Fat Loss","Moderate, sustainable deficit","photo-1517836357463-d25dfeac3438"],
 ["lean-bulk","Lean Bulk","Small controlled surplus","photo-1532384748853-8f54a8f476e2"]
];
function read<T>(key:string,fallback:T):T { try { const v=localStorage.getItem(key); return v?JSON.parse(v):fallback; } catch { return fallback; } }
function Icon({name,size=20}:{name:string;size?:number}) { const p:any={width:size,height:size,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round"}; const m:Record<string,React.ReactNode>={home:<><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9M9 20v-6h6v6"/></>,food:<><path d="M6 3v18M4 3v5a2 2 0 0 0 4 0V3M15 3v18M15 3c3 1 4 4 4 7h-4"/></>,chart:<><path d="M4 19V5M4 19h16"/><path d="m7 15 4-4 3 2 5-6"/></>,activity:<path d="M3 12h5l2-7 4 14 2-7h5"/>,profile:<><circle cx="12" cy="8" r="3"/><path d="M5 20c1-4 3-6 7-6s6 2 7 6"/></>,search:<><circle cx="10.8" cy="10.8" r="6"/><path d="m16 16 4 4"/></>,water:<path d="M12 3s6 6 6 11a6 6 0 0 1-12 0c0-5 6-11 6-11Z"/>,scale:<><path d="M5 6h14l1 14H4L5 6Z"/><path d="M8 10a4 4 0 0 1 8 0M12 10l2-2"/></>,check:<path d="m5 12 4 4L19 6"/>,trash:<><path d="M5 7h14M10 11v6M14 11v6M7 7l1 14h8l1-14M9 7V4h6v3"/></>,close:<path d="m6 6 12 12M18 6 6 18"/>,arrow:<path d="M5 12h14M13 6l6 6-6 6"/>,spark:<path d="m12 3 1.3 5.7L19 10l-5.7 1.3L12 17l-1.3-5.7L5 10l5.7-1.3L12 3Z"/>,calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></>,camera:<><path d="M4 7h4l2-2h4l2 2h4v12H4Z"/><circle cx="12" cy="13" r="3.5"/></>,bell:<><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,note:<><path d="M5 3h14v18H5z"/><path d="M8 8h8M8 12h8M8 16h5"/></>,lock:<><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,sound:<><path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="M17 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/></>}; return <svg {...p}>{m[name]||m.spark}</svg>; }
function beep(enabled:boolean){ if(!enabled) return; try { const C=window.AudioContext||((window as any).webkitAudioContext); const c=new C(); const o=c.createOscillator(); const g=c.createGain(); o.frequency.value=520; g.gain.value=.035; o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.06); } catch {} }
function pandaMoodSound(enabled:boolean,mood:"happy"|"angry"){ if(!enabled)return;try{const C=window.AudioContext||((window as any).webkitAudioContext);const c=new C();const g=c.createGain();g.gain.value=.035;g.connect(c.destination);if(mood==="angry"){const o=c.createOscillator();o.type="sawtooth";o.frequency.setValueAtTime(520,c.currentTime);o.frequency.exponentialRampToValueAtTime(170,c.currentTime+.11);o.frequency.setValueAtTime(620,c.currentTime+.14);o.frequency.exponentialRampToValueAtTime(280,c.currentTime+.25);o.connect(g);o.start();o.stop(c.currentTime+.29);o.onended=()=>void c.close();}else{[660,820,980].forEach((freq,i)=>{const o=c.createOscillator();o.type="sine";o.frequency.value=freq;o.connect(g);const t=c.currentTime+i*.075;o.start(t);o.stop(t+.07);if(i===2)o.onended=()=>void c.close();});}}catch{} }
function caloriePlan(p:Profile){ const age=+p.age,h=+p.height,w=+p.weight; if(!age||!h||!w||!p.sex||age<18) return null; const b=p.sex==="male"?10*w+6.25*h-5*age+5:10*w+6.25*h-5*age-161; const mult:{[k:string]:number}={sedentary:1.2,light:1.375,moderate:1.55,hard:1.725}; const tdee=b*(p.activity==="moderate"?1.55:1.55); let target=tdee; if(p.goal==="fat-loss") target=tdee*.9; if(p.goal==="lean-bulk"||p.goal==="strength") target=tdee*1.07; return {bmr:Math.round(b),tdee:Math.round(tdee),target:Math.round(target),protein:Math.round(w*(p.goal==="fat-loss"?1.7:1.6))}; }
function App(){
 const [page,setPage]=useState<Page>("home"); const [started,setStarted]=useState(()=>read("panda_started",false));
 const [profile,setProfile]=useState<Profile>(()=>{const p=read("panda_profile",{name:"",age:"",sex:"",height:"",weight:"",activity:"moderate",goal:"healthy",targetWeight:"",targetDate:"",setupLocked:false});return {...p,activity:"moderate"};});
 const [foodLog,setFoodLog]=useState<FoodLog[]>(()=>read("panda_food_log",[])); const [weightLog,setWeightLog]=useState<WeightEntry[]>(()=>read("panda_weight_log",[])); const [activityLog,setActivityLog]=useState<ActivityEntry[]>(()=>read("panda_activity_log",[]));
 const [water,setWater]=useState(()=>read("panda_water",0)); const [notes,setNotes]=useState<Note[]>(()=>read("panda_notes",[])); const [reminders,setReminders]=useState<Reminder[]>(()=>read("panda_reminders",[{id:"w",type:"water",time:"10:00",enabled:true},{id:"f",type:"food",time:"13:00",enabled:true},{id:"a",type:"activity",time:"18:00",enabled:true}])); const [sound,setSound]=useState(()=>read("panda_sound",true)); const [pandaMood,setPandaMood]=useState<"normal"|"happy"|"angry">("normal");
 const [noteText,setNoteText]=useState("");
 const [chat,setChat]=useState<ChatMessage[]>(()=>read("panda_coach_chat",[{id:"welcome",role:"panda",text:"Hi. I am Panda. Ask me about your food log, movement, hydration or progress.",time:Date.now()}])); const plan=useMemo(()=>caloriePlan(profile),[profile]); const isTeen=+profile.age>0&&+profile.age<18; const todayFood=foodLog.filter(x=>x.date===today); const todayActivity=activityLog.filter(x=>x.date===today);
 const eaten=todayFood.reduce((s,x)=>s+x.totalCalories,0), protein=todayFood.reduce((s,x)=>s+x.totalProtein,0), carbs=todayFood.reduce((s,x)=>s+x.totalCarbs,0), fat=todayFood.reduce((s,x)=>s+x.totalFat,0);
 useEffect(()=>{localStorage.setItem("panda_started",JSON.stringify(started));localStorage.setItem("panda_profile",JSON.stringify(profile));localStorage.setItem("panda_food_log",JSON.stringify(foodLog));localStorage.setItem("panda_weight_log",JSON.stringify(weightLog));localStorage.setItem("panda_activity_log",JSON.stringify(activityLog));localStorage.setItem("panda_water",JSON.stringify(water));localStorage.setItem("panda_notes",JSON.stringify(notes));localStorage.setItem("panda_reminders",JSON.stringify(reminders));localStorage.setItem("panda_sound",JSON.stringify(sound));localStorage.setItem("panda_coach_chat",JSON.stringify(chat));},[started,profile,foodLog,weightLog,activityLog,water,notes,reminders,sound,chat]);
 function saveProfile(p:Profile){setProfile({...p,activity:"moderate",setupLocked:true}); if(p.weight) saveWeight(+p.weight); setStarted(true);beep(sound);}
 function pandaReply(text:string){
  const q=text.trim().toLowerCase();
  const name=profile.name||"there";
  const goal=GOALS.find(g=>g[0]===profile.goal)?.[1]||"wellbeing";
  const adultPlan=plan?` Your saved adult estimate is about ${plan.tdee} kcal/day for maintenance.`:"";
  const has=(...terms:string[])=>terms.some(t=>q.includes(t));
  const foodLines=(items:Food[])=>items.slice(0,7).map(f=>`• ${f.name} (${f.serving}) — about ${f.calories} kcal; protein ${f.protein} g, carbs ${f.carbs} g, fat ${f.fat} g`).join("\n");
  if(has("low cal","low-cal","lower calorie","low calorie","light snack","light dessert")){
   const items=[...FOOD_DATA].filter(f=>/snack|dessert|fruit|drink|beverage|sweet/i.test(f.category+" "+f.name)).sort((a,b)=>a.calories-b.calories);
   return `Here are some lower-energy options from Panda's food list (values are estimates per listed serving, not a rule about what you should eat):\n${foodLines(items.length?items: [...FOOD_DATA].sort((a,b)=>a.calories-b.calories))}\nChoose a satisfying portion and pair foods as you like. A food's calories alone do not tell you whether it is nutritious.`;
  }
  if(has("high cal","high-cal","higher calorie","high calorie","energy dense","high calorie snack","high calorie dessert")){
   const items=[...FOOD_DATA].filter(f=>/snack|dessert|sweet|dessert|biryani|fried|shake/i.test(f.category+" "+f.name)).sort((a,b)=>b.calories-a.calories);
   return `Here are some higher-energy foods in Panda's list (per listed serving; estimates vary by recipe and portion):\n${foodLines(items.length?items: [...FOOD_DATA].sort((a,b)=>b.calories-a.calories))}\nHigher energy does not mean “bad” food—needs and preferences differ.`;
  }
  if(has("diet plan","give me a diet","make a diet","meal plan","plan my meals","daily menu")){
   return `Of course! 🐼 Here is a flexible balanced-day idea, not a strict diet or calorie limit:\n\nBREAKFAST: idli or dosa with sambar, plus fruit or curd if you like.\nMID-MORNING: fruit, nuts, or a yogurt/curd snack.\nLUNCH: rice or chapati, dal/sambar or another protein food, vegetables, and curd if you enjoy it.\nEVENING: a snack you like, such as sundal, a sandwich, fruit, or a dessert portion.\nDINNER: chapati/rice with vegetables and a protein food such as dal, paneer, egg, fish or chicken.\n\nTell Panda any allergies, vegetarian/non-vegetarian preference, foods you dislike, and your usual meal times to make the ideas fit you. If you are under 18, Panda keeps plans focused on regular balanced meals and growth—not weight-loss calorie restriction.`;
  }
  if(has("dessert","snack list","list of food","food list","show me foods","foods with calories","food names and calories")){
   const items=[...FOOD_DATA].filter(f=>/dessert|snack|sweet/i.test(f.category+" "+f.name));
   return `Here are food options from the saved Panda database with their estimated nutrition per serving:\n${foodLines(items.length?items:[...FOOD_DATA].sort((a,b)=>a.calories-b.calories))}\nThese are estimates; recipes, oils, brands and serving sizes can change the values.`;
  }
  if(has("i like you panda","i like panda","love you panda","panda i like you")) return `Aww, thank you, ${name}. That made Panda happy. I am always glad to chat with you and help with your app.`;
  if(/^(hi|hello|hey|hii|hiii|good morning|good afternoon|good evening|vanakkam)\b/.test(q)) return `Hi ${name}. Panda is here and ready. What are we doing today?`;
  if(has("how are you","how r u")) return `I am doing great, ${name}. Panda is ready for another check-in.`;
  if(has("thank","thanks","tq","thx")) return `You are welcome, ${name}. Panda is happy to help.`;
  if(has("stupid panda","dumb panda","idiot panda","useless panda","bad panda","i hate panda","shut up panda","troll panda","got you panda","prank panda","annoy panda")) return `Heyyy! Panda detected a troll attack. Cute angry mode activated. I forgive you... but the whistle is coming out!`;
  if(has("troll","prank","annoying you","annoy panda","make panda angry","angry panda")) return `Ohhh, so you are trolling Panda today? Cute angry mode activated. One tiny warning whistle!`;
  if(has("who are you","what are you","what can you do")) return `I am Panda. I can be your friendly chat buddy, a teacher who explains wellness topics simply, and a coach who helps you use the information saved in this app.`;
  if(has("my name","remember me")) return `Your saved profile name is ${name}.`;
  if(has("water","hydration","drink water")) return `You have logged ${water} of 8 glasses today. Keep water available during the day and drink regularly, especially when you are thirsty or active. There is no need to force a fixed amount if your body does not need it.`;
  if(has("sleep","tired","rest")) return `Sleep is an important part of wellness. A regular bedtime, a comfortable sleep routine and enough rest can support learning, mood, recovery and everyday energy.`;
  if(has("food","meal","eat","nutrition","protein","carb","fat","diet")){
   if(has("balanced","healthy meal","what should i eat","meal idea","meal plan")) return `As your Panda teacher, remember the simple pattern: include a mix of vegetables or fruit, a carbohydrate food such as rice, dosa, idli or chapati, and a protein source such as dal, eggs, paneer, curd or chicken. Variety matters more than making one meal perfect.`;
   if(has("protein")) return `Protein is one of the nutrients your body uses for growth and tissue repair. Common sources include dal, beans, eggs, dairy foods, paneer, fish and chicken. Your food log can help you see what you have recorded without turning it into a strict target.`;
   if(has("calorie","calories")) return isTeen?`Your profile is under 18, so Panda will not prescribe calorie restriction, a calorie deficit or a bulking target. I can still explain what calories mean and help you understand the food you have logged.`:plan?`Calories are a measure of food energy.${adultPlan} Use estimates as information rather than a rule.`:`Calories are a measure of food energy. Panda can explain labels and logged foods, but a useful daily estimate needs the relevant profile details.`;
   return todayFood.length?`You have ${todayFood.length} saved food entries today. I can help you review them and think about variety, hydration and regular meals.`:`No food has been saved today yet. Open Food, choose an item, review the portion and confirm it before saving.`;
  }
  if(has("activity","exercise","move","workout","walking","running","cycling")) return isTeen?`Movement can be a positive part of your day. Choose activities you enjoy, include rest, and listen to your body. Panda records movement as a wellbeing habit rather than using exercise to compensate for food.`:`You have ${todayActivity.length} activity record${todayActivity.length===1?"":"s"} today. I can help you review the activities you saved and explain general movement concepts.`;
  if(has("progress","weight","graph","chart","trend")) return weightLog.length?`Your Progress page contains ${weightLog.length} real saved weight entr${weightLog.length===1?"y":"ies"}. The 3D graph uses Date on the X-axis and Weight in kg on the Y-axis. Drag the graph to change the perspective.`:`Your Progress page is ready. Save a real weight entry and Panda will show it on the 3D Date-versus-Weight graph.`;
  if(has("scanner","scan","photo food","food photo","picture")) return `Panda Vision is designed to identify the food name from your photo first. You then enter the quantity yourself and review the matched food before saving.`;
  if(has("reminder","remind")) return `Your reminders are saved in the app settings. You can manage water, food and activity reminders from Profile without changing the chat.`;
  if(has("profile","height","age","goal")) return `Your saved profile includes your name, age, sex, height, weight, goal and the Moderate activity setting. Some identity choices are locked after setup so the app stays consistent.`;
  if(has("teacher","teach me","explain","what is")) return `Teacher mode is on. Ask me a wellness question and I will explain it in simple steps, with examples when useful.`;
  if(has("coach","coach me","motivate","motivation","focus today")) return `Coach mode: choose one small, realistic wellness action for today, such as logging a meal, drinking some water, taking a comfortable walk, getting enough rest or writing a daily note. Consistency matters more than perfection.`;
  if(has("friend","talk","chat","bored","sad","bad day")) return `Friend mode: I am listening. We can talk about your app, your routine or something completely different.`;
  if(has("plan","calorie plan")) return isTeen?`Your profile is in healthy-growth mode. Panda does not prescribe calorie restriction or a weight-loss/bulking plan for an under-18 profile.`:plan?`Your ${goal} profile has an estimated maintenance need based on the information saved in the app.${adultPlan}`:`Complete the adult profile measurements if you want the app's estimate.`;
  return `I understand, ${name}. I can help as your friend, teacher or coach. Try asking me about your food log, water, movement, sleep, progress graph, reminders, nutrition basics or just chat with Panda.`;
 }
 function sendCoachMessage(raw:string){
  const text=raw.trim();if(!text)return;
  const q=text.toLowerCase();
  const angry=/(stupid panda|dumb panda|idiot panda|useless panda|bad panda|hate panda|shut up panda|troll|prank|annoy panda|make panda angry|got you panda)/.test(q);
  const happy=/(i like you panda|i like panda|love you panda|thank|thanks|tq|thx|\bhi\b|\bhello\b|\bhey\b|good morning|good evening|vanakkam)/.test(q);
  const mood=angry?"angry":happy?"happy":"normal";
  setPandaMood(mood);
  setChat(a=>[...a,{id:crypto.randomUUID(),role:"user",text,time:Date.now()}]);
  beep(sound);
  if(mood!=="normal") pandaMoodSound(sound,mood);
  window.setTimeout(()=>{
    setChat(a=>[...a,{id:crypto.randomUUID(),role:"panda",text:pandaReply(text),time:Date.now()}]);
    beep(sound);
    if(mood!=="normal") pandaMoodSound(sound,mood);
    window.setTimeout(()=>setPandaMood("normal"),1200);
  },350);
 }
 function saveWeight(w:number){if(!w||w<=0)return;setWeightLog(a=>[...a.filter(x=>x.date!==today),{date:today,weight:w}].sort((a,b)=>a.date.localeCompare(b.date)));setProfile(p=>({...p,weight:String(w)}));}
 function addFood(f:Food,q:number){const n=Math.max(.25,q);setFoodLog(a=>[{...f,logId:crypto.randomUUID(),quantity:n,date:today,totalCalories:Math.round(f.calories*n),totalProtein:+(f.protein*n).toFixed(1),totalCarbs:+(f.carbs*n).toFixed(1),totalFat:+(f.fat*n).toFixed(1)},...a]);beep(sound);}
 function addActivity(name:string,min:number,image:string){const mult=ACTIVITIES.find(a=>a[0]===name)?.[2]||4;const kcal=Math.round((mult*+profile.weight*min)/60);setActivityLog(a=>[{id:crypto.randomUUID(),name,minutes:min,date:today,image,caloriesBurned:kcal},...a]);beep(sound);}
 function updateActivity(id:string,name:string,min:number){setActivityLog(a=>a.map(x=>{if(x.id!==id)return x;const mult=ACTIVITIES.find(v=>v[0]===name)?.[2]||4;const kcal=Math.round((mult*+profile.weight*min)/60);return {...x,name,minutes:min,caloriesBurned:kcal};}));beep(sound);}
 function removeActivity(id:string){setActivityLog(a=>a.filter(x=>x.id!==id));beep(sound);}
 if(!started) return <Setup onFinish={saveProfile} sound={sound} setSound={setSound}/>;
 return <div className="appShell"><header className="topBar"><button className="brand" onClick={()=>setPage("home")}><div className="brandMark"><img src="/panda-reference.png" alt="Panda app logo"/></div><div><strong>Panda</strong><span>Calorie Tracker</span></div></button><button className="avatar" onClick={()=>setPage("profile")}>{profile.name.slice(0,1).toUpperCase()}</button></header>
 <main className="content">{page==="home"&&<Home profile={profile} plan={plan} eaten={eaten} protein={protein} water={water} setWater={setWater} setPage={setPage} todayFood={todayFood} todayActivity={todayActivity}/>} {page==="food"&&<FoodTracker log={todayFood} addFood={addFood} removeFood={id=>setFoodLog(a=>a.filter(x=>x.logId!==id))}/>} {page==="progress"&&<Progress data={weightLog} saveWeight={saveWeight}/>} {page==="activity"&&<ActivityTracker log={todayActivity} add={addActivity} update={updateActivity} remove={removeActivity}/>} {page==="coach"&&<Coach profile={profile} plan={plan} eaten={eaten} messages={chat} onSend={sendCoachMessage} pandaMood={pandaMood} sound={sound}/>} {page==="history"&&<History food={foodLog} activity={activityLog} notes={notes}/>} {page==="profile"&&<Profile profile={profile} setProfile={setProfile} reminders={reminders} setReminders={setReminders} sound={sound} setSound={setSound} noteText={noteText} setNoteText={setNoteText} notes={notes} setNotes={setNotes} saveWeight={saveWeight}/>}</main>
 <nav className="bottomNav">{([['home','Home'],['food','Food'],['progress','Progress'],['activity','Activity'],['coach','Panda']] as const).map(([i,l])=><button key={i} className={page===i?'navButton active':'navButton'} onClick={()=>setPage(i)}><Icon name={i==='coach'?'spark':i} size={21}/><span>{l}</span></button>)}</nav></div>;
}
function Setup({onFinish,sound,setSound}:{onFinish:(p:Profile)=>void;sound:boolean;setSound:(v:boolean)=>void}){const [p,setP]=useState<Profile>({name:"",age:"",sex:"",height:"",weight:"",activity:"moderate",goal:"healthy",targetWeight:"",targetDate:"",setupLocked:true});const [step,setStep]=useState(1);const valid=step===1?!!p.name&&+p.age>0:step===2?!!p.sex:step===3?!!p.height&&!!p.weight:true; return <div className="setup"><div className="setupGlow"/><div className="setupCard"><div className="pandaMini"><img src="/panda-reference.png" alt="Panda"/></div><span className="eyebrow">PANDA SETUP</span><h1>{step===1?'Welcome':step===2?'Choose your profile type':step===3?'Your measurements':'Choose your goal'}</h1><p>{step===4?'This goal will be locked after setup. You can still update height, weight and activity later.':'A one-time premium setup keeps your core identity choices consistent.'}</p>{step===1&&<div className="formGrid"><label>Name<input value={p.name} onChange={e=>setP({...p,name:e.target.value})} placeholder="Your name"/></label><label>Age<input type="number" min="1" value={p.age} onChange={e=>setP({...p,age:e.target.value})}/></label></div>}{step===2&&<div className="choiceGrid">{[['male','Male'],['female','Female']].map(([v,l])=><button className={p.sex===v?'choice selected':'choice'} onClick={()=>setP({...p,sex:v})} key={v}><span className="choiceArt">{v==='male'?'M':'F'}</span><strong>{l}</strong><Icon name={p.sex===v?'check':'profile'}/></button>)}</div>}{step===3&&<><div className="formGrid"><label>Height<input type="number" value={p.height} onChange={e=>setP({...p,height:e.target.value})} placeholder="cm"/></label><label>Weight<input type="number" value={p.weight} onChange={e=>setP({...p,weight:e.target.value})} placeholder="kg"/></label></div><div className="premiumField"><label>Activity level</label><div className="lockedField premiumLocked"><span>Default app setting</span><strong>Moderate</strong><Icon name="lock" size={15}/></div></div></>}{step===4&&<div className="goalGrid">{GOALS.map(([v,t,d,im])=><button className={p.goal===v?'goalCard selected':'goalCard'} onClick={()=>setP({...p,goal:v})} key={v}><img src={img(im)}/><div><strong>{t}</strong><span>{d}</span></div><Icon name={p.goal===v?'check':'arrow'}/></button>)}</div>} {step===4&&<div className="formGrid"><label>Target weight<input type="number" value={p.targetWeight} onChange={e=>setP({...p,targetWeight:e.target.value})} placeholder="Optional"/></label><div className="premiumField calendarField"><label>Target date</label><PremiumCalendar value={p.targetDate} onChange={v=>setP({...p,targetDate:v})}/></div></div>}<div className="setupActions"><button className="soundToggle" onClick={()=>setSound(!sound)}><Icon name="sound"/>{sound?'Sound on':'Sound off'}</button>{step>1&&<button className="secondaryButton" onClick={()=>setStep(step-1)}>Back</button>}<button className="primaryButton" disabled={!valid} onClick={()=>step<4?setStep(step+1):onFinish(p)}>{step<4?'Continue':'Finish setup'}<Icon name="arrow"/></button></div></div></div>}
function Home({profile,plan,eaten,protein,water,setWater,setPage,todayFood,todayActivity}:{profile:Profile;plan:any;eaten:number;protein:number;water:number;setWater:any;setPage:any;todayFood:FoodLog[];todayActivity:ActivityEntry[]}){const goal=GOALS.find(g=>g[0]===profile.goal)?.[1]||profile.goal;return <div className="page"><section className="heroPanel"><div><span className="eyebrow">TODAY</span><h1>Hi, {profile.name}</h1><p>{new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</p></div><div className="goalPill"><Icon name="lock" size={15}/>{goal}</div></section><div className="statsGrid"><Stat label="Weight" v={profile.weight||'--'} u="kg" icon="scale"/><Stat label="Height" v={profile.height||'--'} u="cm" icon="chart"/><Stat label="Water" v={String(water)} u="/8" icon="water"/><Stat label="Protein" v={protein.toFixed(0)} u="g" icon="spark"/></div><section className="premiumCalorieCard"><div><span className="eyebrow light">GOAL-BASED CALORIE PLAN</span><h2>{plan?plan.target:'--'} <small>kcal / day</small></h2><p>{+profile.age<18?"Healthy-growth mode: this screen records food and movement without prescribing restriction.":plan?`${goal} plan • maintenance ${plan.tdee} kcal • BMR ${plan.bmr} kcal • Moderate activity setting`:"Complete adult profile details for a plan."}</p></div><div className="calorieProgress"><span style={{width:`${plan?Math.min(100,eaten/plan.target*100):0}%`}}/></div><div className="macroRow"><span>Logged <b>{eaten}</b></span><span>Protein <b>{protein.toFixed(0)}g</b></span><span>Carbs <b>{todayFood.reduce((s,x)=>s+x.totalCarbs,0).toFixed(0)}g</b></span><span>Fat <b>{todayFood.reduce((s,x)=>s+x.totalFat,0).toFixed(0)}g</b></span></div></section><div className="quickGrid"><Quick t="Log food" d="Search and review meals" i="food" c="food" setPage={setPage}/><Quick t="Movement" d="Track activity" i="activity" c="activity" setPage={setPage}/><Quick t="Panda Coach" d="Personal guidance" i="spark" c="coach" setPage={setPage}/><Quick t="Progress" d="Animated weight graph" i="chart" c="progress" setPage={setPage}/><Quick t="History" d="Saved daily records" i="note" c="history" setPage={setPage}/></div><div className="snapshotGrid"><button className="snapshotCard" onClick={()=>setWater((x:number)=>Math.min(8,x+1))}><span>Water</span><strong>{water}/8</strong><small>Add one glass</small></button><div className="snapshotCard"><span>Food entries</span><strong>{todayFood.length}</strong><small>today</small></div><div className="snapshotCard"><span>Activities</span><strong>{todayActivity.reduce((s,x)=>s+x.caloriesBurned,0)}</strong><small>kcal burned today</small></div></div></div>}
function Stat({label,v,u,icon}:{label:string;v:string;u:string;icon:string}){return <div className="statCard"><div className="statIcon"><Icon name={icon}/></div><span>{label}</span><strong>{v} <small>{u}</small></strong></div>}
function Quick({t,d,i,c,setPage}:{t:string;d:string;i:string;c:Page;setPage:any}){return <button className="quickAction" onClick={()=>setPage(c)}><div className="quickActionIcon"><Icon name={i}/></div><div><strong>{t}</strong><span>{d}</span></div><Icon name="arrow" size={17}/></button>}
function FoodTracker({log,addFood,removeFood}:{log:FoodLog[];addFood:(f:Food,q:number)=>void;removeFood:(id:string)=>void}){const [q,setQ]=useState('');const [sel,setSel]=useState<Food|null>(null);const [qty,setQty]=useState(1);const [scan,setScan]=useState(false);const [scanName,setScanName]=useState('');const foods=FOOD_DATA.filter(f=>f.name.toLowerCase().includes(q.toLowerCase())||f.category.toLowerCase().includes(q.toLowerCase()));return <div className="page"><Heading e="FOOD" t="Build your food log" s="Search food or use the photo scanner. Nothing is saved until you confirm."/><div className="searchRow"><div className="searchBox"><Icon name="search"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search food or drink"/></div><button className="scannerButton" onClick={()=>setScan(true)}><Icon name="camera"/>Scan food photo</button></div><div className="foodGrid">{foods.map(f=><button className="foodCard" key={f.id} onClick={()=>{setSel(f);setQty(1)}}><img src={f.image} alt={f.name}/><div><span>{f.category}</span><strong>{f.name}</strong><small>{f.serving}</small><b>{f.calories} kcal</b></div></button>)}</div><section className="loggedSection"><Heading e="TODAY" t="Saved food"/>{log.length?<div className="loggedList">{log.map(x=><div className="loggedItem" key={x.logId}><img src={x.image} alt=""/><div><strong>{x.name}</strong><span>{x.quantity} × {x.serving}</span><small>{x.totalProtein}g protein · {x.totalCarbs}g carbs · {x.totalFat}g fat</small></div><b>{x.totalCalories} kcal</b><button className="iconButton" onClick={()=>removeFood(x.logId)}><Icon name="trash" size={18}/></button></div>)}</div>:<Empty t="Nothing logged yet" d="Select a food above."/>}</section>{sel&&<Modal close={()=>setSel(null)}><img className="modalImage" src={sel.image} alt={sel.name}/><span className="eyebrow">REVIEW</span><h2>{sel.name}</h2><p>{sel.calories} kcal · {sel.protein}g protein · {sel.carbs}g carbs · {sel.fat}g fat per {sel.serving}.</p><div className="quantityControl"><button onClick={()=>setQty(Math.max(.25,qty-.25))}>−</button><strong>{qty}</strong><button onClick={()=>setQty(Math.min(10,qty+.25))}>+</button></div><button className="primaryButton full" onClick={()=>{addFood(sel,qty);setSel(null)}}>Confirm and save <Icon name="check"/></button></Modal>}{scan&&<Scanner close={()=>setScan(false)} foods={FOOD_DATA} add={addFood} setName={setScanName} name={scanName}/>}</div>}
function Scanner({close,foods,add,setName,name}:{close:()=>void;foods:Food[];add:(f:Food,q:number)=>void;setName:(s:string)=>void;name:string}){
 const inputRef=useRef<HTMLInputElement>(null);
 const videoRef=useRef<HTMLVideoElement>(null);
 const canvasRef=useRef<HTMLCanvasElement>(null);
 const [preview,setPreview]=useState("");
 const [cameraError,setCameraError]=useState("");
 const [picked,setPicked]=useState<Food|null>(null);
 const [quantity,setQuantity]=useState(1);
 const [status,setStatus]=useState<"idle"|"identifying"|"ready"|"error">("idle");
 const [step,setStep]=useState<"choose"|"camera"|"review">("choose");
 useEffect(()=>()=>{const stream=videoRef.current?.srcObject as MediaStream|null;stream?.getTracks().forEach(t=>t.stop());},[]);
 function findFoodByName(label:string){const clean=label.trim().toLowerCase();return foods.find(f=>f.name.toLowerCase()===clean)||foods.find(f=>clean.includes(f.name.toLowerCase()))||foods.find(f=>f.name.toLowerCase().includes(clean));}
 async function identify(file:File){
   setStatus("identifying");setStep("review");setPicked(null);setName("Identifying food...");
   const form=new FormData();form.append("image",file);
   try{
     const res=await fetch("/api/food-identify",{method:"POST",body:form});
     if(!res.ok) throw new Error("Food identification service is unavailable");
     const data=await res.json();
     const detected=typeof data?.name==="string"?data.name.trim():"";
     const match=detected?findFoodByName(detected):null;
     if(!detected) throw new Error("No food name was returned");
     setName(detected);setPicked(match||null);setStatus(match?"ready":"error");
   }catch{
     setName("");setPicked(null);setStatus("error");
   }
 }
 function chooseFile(file:File){setPreview(URL.createObjectURL(file));setQuantity(1);identify(file);}
 async function startCamera(){
   setCameraError("");
   if(!navigator.mediaDevices?.getUserMedia){setCameraError("Camera access is not available in this browser.");return;}
   try{const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"},width:{ideal:1280},height:{ideal:720}},audio:false});if(videoRef.current){videoRef.current.srcObject=stream;await videoRef.current.play();}setStep("camera");}
   catch{setCameraError("Camera permission was blocked. Allow camera access and try again.");}
 }
 function stopCamera(){const stream=videoRef.current?.srcObject as MediaStream|null;stream?.getTracks().forEach(t=>t.stop());if(videoRef.current)videoRef.current.srcObject=null;}
 function capture(){const video=videoRef.current,canvas=canvasRef.current;if(!video||!canvas)return;canvas.width=video.videoWidth||900;canvas.height=video.videoHeight||600;const ctx=canvas.getContext("2d");if(!ctx)return;ctx.drawImage(video,0,0,canvas.width,canvas.height);canvas.toBlob(blob=>{if(blob){setPreview(URL.createObjectURL(blob));stopCamera();setQuantity(1);identify(new File([blob],"food-photo.jpg",{type:"image/jpeg"}));}},"image/jpeg",.9);}
 return <Modal close={()=>{stopCamera();close();}}>
   <div className="scannerPro">
     <div className="scannerHero"><div className="scannerIcon"><Icon name="camera" size={28}/></div><div><span className="eyebrow">PANDA VISION</span><h2>Food photo scanner</h2><p>Panda identifies the food name first. You enter the quantity yourself.</p></div></div>
     {step==="choose"&&<div className="scannerChoices"><button type="button" className="scannerChoice primaryScan" onClick={startCamera}><span className="scanChoiceIcon"><Icon name="camera" size={24}/></span><strong>Use camera</strong><small>Take a food photo</small></button><button type="button" className="scannerChoice" onClick={()=>inputRef.current?.click()}><span className="scanChoiceIcon"><Icon name="note" size={24}/></span><strong>Upload photo</strong><small>Choose a food image</small></button></div>}
     {step==="camera"&&<div className="cameraStage"><video ref={videoRef} playsInline muted/><div className="cameraReticle"/><div className="cameraControls"><button type="button" className="secondaryButton" onClick={()=>{stopCamera();setStep("choose")}}>Cancel</button><button type="button" className="captureButton" onClick={capture}><span/></button><span className="cameraHint">Tap to capture</span></div></div>}
     {step==="review"&&<div className="scannerReview">
       {preview?<img className="scanPreview premiumPreview" src={preview} alt="Food preview"/>:<div className="scanPlaceholder"><Icon name="camera" size={30}/><span>No preview yet</span></div>}
       {status==="identifying"&&<div className="scanStatus"><span className="statusDot scanning"/><div><strong>Identifying food...</strong><small>Panda is checking the photo for the food name.</small></div></div>}
       {status==="ready"&&<div className="scanStatus"><span className="statusDot"/><div><strong>Food identified</strong><small>Only the food name was identified. Enter the quantity below.</small></div></div>}
       {status==="error"&&<div className="scanStatus scanStatusError"><span className="statusDot error"/><div><strong>Food name could not be matched</strong><small>The photo was uploaded, but the food-recognition AI service is not connected or could not identify it. You can type the food name below and select a match from Panda’s database.</small></div></div>}
       <label className="scanNameField">Food name<input value={name} readOnly={status!=="error"} onChange={e=>setName(e.target.value)} placeholder="Identified food name"/></label>
       {status==="error"&&<div className="scanManualMatch"><label className="scanNameField">Find matching food in Panda database<select value={picked?.id??""} onChange={e=>{const f=foods.find(x=>String(x.id)===e.target.value)||null;setPicked(f);setStatus(f?"ready":"error");setName(f?.name||name);}}><option value="">Choose a food match…</option>{foods.filter(f=>!name||f.name.toLowerCase().includes(name.toLowerCase())||name.toLowerCase().includes(f.name.toLowerCase())).slice(0,30).map(f=><option key={f.id} value={f.id}>{f.name} — {f.calories} kcal / {f.serving}</option>)}</select></label><p className="scannerHint">Photo identification needs a configured server/API. This manual match lets you continue without pretending the photo was recognized.</p></div>}
       {picked&&status==="ready"&&<><div className="quantityControl"><button type="button" onClick={()=>setQuantity(Math.max(.25,quantity-.25))}>−</button><strong>{quantity}</strong><button type="button" onClick={()=>setQuantity(Math.min(10,quantity+.25))}>+</button></div><div className="scannerNutritionPreview"><span>{picked.serving}</span><strong>{Math.round(picked.calories*quantity)} kcal</strong></div><button type="button" className="primaryButton full" onClick={()=>{add(picked,quantity);close()}}>Confirm food and quantity <Icon name="check"/></button></>}
       <button type="button" className="secondaryButton full" onClick={()=>{setStep("choose");setStatus("idle");setPicked(null);setName("")}}>Scan another photo</button>
     </div>}
     {cameraError&&<div className="cameraError">{cameraError}</div>}
     <input ref={inputRef} className="hiddenFileInput" type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(f)chooseFile(f);e.currentTarget.value=""}}/>
     <canvas ref={canvasRef} className="hiddenCanvas"/>
   </div>
 </Modal>
}
function Progress({data,saveWeight}:{data:WeightEntry[];saveWeight:(n:number)=>void}){
 const [range,setRange]=useState(30);
 const [input,setInput]=useState("");
 const [hover,setHover]=useState<WeightEntry|null>(null);
 const [azimuth,setAzimuth]=useState(-18);
 const [tilt,setTilt]=useState(18);
 const drag=useRef<{x:number;y:number;az:number;ti:number}|null>(null);
 const d=[...data].sort((a,b)=>a.date.localeCompare(b.date)).slice(-range);
 const vals=d.map(x=>x.weight);
 const min=d.length?Math.min(...vals):0,max=d.length?Math.max(...vals):1,pad=Math.max((max-min)*.2,.8),lo=min-pad,hi=max+pad;
 const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
 const rad=(n:number)=>n*Math.PI/180;
 function project(x:number,y:number,z:number){
   const yaw=rad(azimuth),pitch=rad(tilt),xx=x-.5,yy=y-.5,zz=z-.5;
   const rx=xx*Math.cos(yaw)-zz*Math.sin(yaw);
   const rz=xx*Math.sin(yaw)+zz*Math.cos(yaw);
   const ry=yy*Math.cos(pitch)-rz*Math.sin(pitch);
   const depth=yy*Math.sin(pitch)+rz*Math.cos(pitch);
   return {x:470+rx*700+depth*42,y:238-ry*310-depth*18};
 }
 const pts=d.map((item,i)=>{const x=d.length<2?.5:i/(d.length-1),y=(item.weight-lo)/(hi-lo);return {...item,nx:x,ny:y,p:project(x,y,.5)};});
 const linePoints=pts.map(p=>`${p.p.x.toFixed(1)},${p.p.y.toFixed(1)}`).join(" ");
 const areaPoints=pts.length?`${pts[0].p.x.toFixed(1)},340 ${linePoints} ${pts[pts.length-1].p.x.toFixed(1)},340`:"";
 const yTicks=[0,.25,.5,.75,1].map(t=>({t,w:lo+(hi-lo)*t}));
 const baseA=project(0,0,0),baseB=project(1,0,0),baseC=project(1,0,1),topA=project(0,1,0);
 function submit(){const n=Number(input);if(Number.isFinite(n)&&n>0){saveWeight(n);setInput("");}}
 function beginDrag(e:React.PointerEvent<SVGSVGElement>){drag.current={x:e.clientX,y:e.clientY,az:azimuth,ti:tilt};e.currentTarget.setPointerCapture(e.pointerId);}
 function moveDrag(e:React.PointerEvent<SVGSVGElement>){if(!drag.current)return;const dx=e.clientX-drag.current.x,dy=e.clientY-drag.current.y;setAzimuth(clamp(drag.current.az-dx*.35,-55,55));setTilt(clamp(drag.current.ti+dy*.28,8,38));}
 function endDrag(){drag.current=null;}
 return <div className="page">
   <Heading e="PROGRESS" t="Your weight journey" s="A 3D view of the real weight entries you save. X-axis is date and Y-axis is weight in kg."/>
   <div className="progressToolbar"><div><span className="eyebrow">TIME WINDOW</span><strong>3D weight trend</strong></div><div className="rangeTabs">{[7,30,90].map(x=><button type="button" className={range===x?"active":""} onClick={()=>setRange(x)} key={x}>{x}D</button>)}</div></div>
   <section className="chartCard premiumChart">
     <div className="chartHeader"><div><span className="eyebrow">LATEST WEIGHT</span><h2>{d.length?`${d[d.length-1].weight.toFixed(1)} kg`:"No entries yet"}</h2></div><span className="goalPill">{d.length>1?`${(d[d.length-1].weight-d[0].weight).toFixed(1)} kg across view`:"Start today"}</span></div>
     {d.length?<div className="graph3DBox">
       <div className="graph3DHint">Drag the graph to rotate the 3D view</div>
       <svg className="graph3DSvg" viewBox="0 0 940 410" role="img" aria-label="3D weight graph with date on the X axis and weight in kilograms on the Y axis" onPointerDown={beginDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onPointerLeave={endDrag}>
         <defs><linearGradient id="weight3DArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#237a52" stopOpacity=".34"/><stop offset="1" stopColor="#237a52" stopOpacity=".03"/></linearGradient><linearGradient id="weight3DLine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#15573a"/><stop offset="1" stopColor="#4aaf78"/></linearGradient><filter id="weight3DGlow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
         <g className="graph3DGrid">
           {[0,.25,.5,.75,1].map((t,i)=>{const a=project(0,t,0),b=project(1,t,0),c=project(1,t,1);return <g key={i}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y}/><line x1={b.x} y1={b.y} x2={c.x} y2={c.y}/></g>})}
           {[0,.25,.5,.75,1].map((t,i)=>{const a=project(t,0,0),b=project(t,0,1);return <line key={'d'+i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}/>})}
         </g>
         <path className="graph3DArea" d={areaPoints?`M ${areaPoints.split(' ').join(' L ')}`:""}/>
         <polyline className="graph3DLineShadow" points={linePoints}/><polyline className="graph3DLine" points={linePoints}/>
         {pts.map((p,i)=><g key={p.date} className="graph3DPointGroup" onPointerEnter={()=>setHover(p)} onPointerLeave={()=>setHover(null)} onClick={()=>setHover(p)}><circle cx={p.p.x} cy={p.p.y} r={i===pts.length-1?8:5.5} className={i===pts.length-1?"graph3DPoint latest":"graph3DPoint"}/><circle cx={p.p.x} cy={p.p.y} r={i===pts.length-1?3.5:2.2} className="graph3DPointCore"/></g>)}
         <line className="graph3DAxis" x1={baseA.x} y1={baseA.y} x2={baseB.x} y2={baseB.y}/><line className="graph3DAxis" x1={baseA.x} y1={baseA.y} x2={topA.x} y2={topA.y}/><line className="graph3DAxisDepth" x1={baseB.x} y1={baseB.y} x2={baseC.x} y2={baseC.y}/>
         <text className="graph3DAxisLabel" x={baseB.x-8} y={baseB.y+31}>DATE</text><text className="graph3DAxisLabel" x={topA.x-22} y={topA.y-14}>WEIGHT (kg)</text><text className="graph3DAxisDepthLabel" x={baseC.x+4} y={baseC.y+16}>DEPTH</text>
         {yTicks.map((t,i)=>{const p=project(0,t.t,0);return <text key={i} className="graph3DYLabel" x={p.x-42} y={p.y+4}>{t.w.toFixed(1)}</text>})}
       </svg>
       <div className="graph3DDateLabels"><span>{d[0].date.slice(5)}</span><span>{d[d.length-1].date.slice(5)}</span></div>
       {hover&&<div className="graph3DTooltip"><strong>{hover.weight.toFixed(1)} kg</strong><span>{new Date(hover.date+"T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</span></div>}
       <div className="graph3DControls"><button type="button" onClick={()=>{setAzimuth(-18);setTilt(18)}}>Reset view</button><span>X Date</span><span>Y Weight (kg)</span></div>
     </div>:<Empty t="No weight entries" d="Save your first real weight below to start the graph."/>}
   </section>
   <section className="weightEditorPro"><div className="weightEditorIcon"><Icon name="scale" size={25}/></div><div className="weightEditorContent"><span className="eyebrow">DAILY CHECK-IN</span><h2>Today's weight</h2><p>Save one real measurement. The 3D graph updates from your saved data.</p><div className="weightEntryControl"><button type="button" onClick={()=>setInput(String(Math.max(.1,(Number(input||0)-.1)).toFixed(1)))}>−</button><input inputMode="decimal" value={input} onChange={e=>setInput(e.target.value.replace(/[^0-9.]/g,""))} placeholder="0.0"/><span>kg</span><button type="button" onClick={()=>setInput(String((Number(input||0)+.1).toFixed(1)))}>+</button></div></div><button type="button" className="primaryButton weightSaveButton" onClick={submit} disabled={!input.trim()}>Save weight <Icon name="check"/></button></section>
 </div>
}
function ActivityTracker({log,add,update,remove}:{log:ActivityEntry[];add:(n:string,m:number,i:string)=>void;update:(id:string,n:string,m:number)=>void;remove:(id:string)=>void}){
 const [sel,setSel]=useState<any>(null);
 const [edit,setEdit]=useState<ActivityEntry|null>(null);
 const [min,setMin]=useState(30);
 function openNew(a:any){setSel(a);setMin(30);}
 function openEdit(a:ActivityEntry){setEdit(a);setMin(a.minutes);}
 const editMult=(name:string)=>ACTIVITIES.find(a=>a[0]===name)?.[2]||4;
 return <div className="page">
   <Heading e="ACTIVITY" t="Move your way" s="Each saved activity shows an estimated energy expenditure based on body weight, activity type and duration."/>
   <div className="activityInsight"><div><span className="eyebrow">TODAY</span><strong>{log.reduce((s,x)=>s+x.caloriesBurned,0)} kcal</strong><small>estimated activity expenditure</small></div><div><span className="eyebrow">SESSIONS</span><strong>{log.length}</strong><small>saved today</small></div></div>
   <div className="activityGrid">{ACTIVITIES.map(a=><button type="button" className="activityCard" key={a[0]} onClick={()=>openNew(a)}><img src={img(a[1])} alt={a[0]}/><div className="activityCardShade"/><div className="activityCardContent"><strong>{a[0]}</strong><span>Tap to log</span></div></button>)}</div>
   <section className="loggedSection"><Heading e="TODAY" t="Activity log"/>{log.length?<div className="loggedList">{log.map(x=><div className="activityLogItem" key={x.id}><img src={x.image} alt=""/><div className="activityLogMain"><strong>{x.name}</strong><span>{x.minutes} min</span><b>{x.caloriesBurned} kcal burned</b></div><div className="activityActions"><button type="button" onClick={()=>openEdit(x)}>Edit</button><button type="button" className="dangerText" onClick={()=>remove(x.id)}>Delete</button></div></div>)}</div>:<Empty t="No movement logged" d="Choose an activity above."/>}</section>
   {sel&&<Modal close={()=>setSel(null)}><img className="modalImage" src={img(sel[1])} alt={sel[0]}/><span className="eyebrow">REVIEW ACTIVITY</span><h2>{sel[0]}</h2><div className="quantityControl"><button type="button" onClick={()=>setMin(Math.max(5,min-5))}>−</button><strong>{min} min</strong><button type="button" onClick={()=>setMin(Math.min(300,min+5))}>+</button></div><div className="burnPreview"><span>Estimated burned</span><strong>{Math.round((sel[2]*+read<Profile>("panda_profile",{} as Profile).weight*min)/60)||0} kcal</strong></div><button type="button" className="primaryButton full" onClick={()=>{add(sel[0],min,img(sel[1]));setSel(null)}}>Confirm and save <Icon name="check"/></button></Modal>}
   {edit&&<Modal close={()=>setEdit(null)}><span className="eyebrow">EDIT ACTIVITY</span><h2>Correct your entry</h2><label className="scanNameField">Activity<select value={edit.name} onChange={e=>setEdit({...edit,name:e.target.value})}>{ACTIVITIES.map(a=><option key={a[0]} value={a[0]}>{a[0]}</option>)}</select></label><div className="quantityControl"><button type="button" onClick={()=>setMin(Math.max(5,min-5))}>−</button><strong>{min} min</strong><button type="button" onClick={()=>setMin(Math.min(300,min+5))}>+</button></div><div className="burnPreview"><span>Updated estimate</span><strong>{Math.round((editMult(edit.name)*+read<Profile>("panda_profile",{} as Profile).weight*min)/60)||0} kcal</strong></div><button type="button" className="primaryButton full" onClick={()=>{update(edit.id,edit.name,min);setEdit(null)}}>Save correction <Icon name="check"/></button></Modal>}
 </div>
}
function Coach({profile,plan,eaten,messages,onSend,pandaMood,sound}:{profile:Profile;plan:any;eaten:number;messages:ChatMessage[];onSend:(text:string)=>void;pandaMood:"normal"|"happy"|"angry";sound:boolean}){const [text,setText]=useState("");const [typing,setTyping]=useState(false);const bottom=useRef<HTMLDivElement>(null);useEffect(()=>{bottom.current?.scrollIntoView({behavior:"smooth"})},[messages.length]);
 useEffect(()=>{if(!sound)return;let ctx:AudioContext|undefined;const oscillators:OscillatorNode[]=[];let master:GainNode|undefined;try{const C=window.AudioContext||((window as any).webkitAudioContext);ctx=new C();master=ctx.createGain();master.gain.value=0.012;master.connect(ctx.destination);[174.61,220,261.63].forEach((hz,i)=>{const o=ctx!.createOscillator();const g=ctx!.createGain();o.type="sine";o.frequency.value=hz;g.gain.value=[0.55,0.32,0.18][i];o.connect(g);g.connect(master!);o.start();oscillators.push(o);});if(ctx.state==="suspended")void ctx.resume();}catch{}return()=>{oscillators.forEach(o=>{try{o.stop();o.disconnect()}catch{}});try{master?.disconnect();void ctx?.close()}catch{}}},[sound]);function send(v=text){const value=v.trim();if(!value)return;onSend(value);setText("");setTyping(true);window.setTimeout(()=>setTyping(false),500);}const goal=GOALS.find(g=>g[0]===profile.goal)?.[1]||"wellbeing";return <div className="page"><Heading e="PANDA AI COACH" t="Your personal coach" s="Ask Panda about the information saved in your app."/><div className="coachHero"><PandaCharacter/><div><span className="eyebrow">COACH STATUS</span><h2>Ready to help</h2><p>{goal} profile · {eaten} kcal logged today{plan?` · ${plan.tdee} kcal maintenance estimate`:""}</p></div></div><section className="coachChat"><div className="chatHeader"><div><span className="eyebrow">CHAT</span><h2>Ask Panda</h2></div><span className="onlinePill"><i/>Ready</span></div><div className="chatMessages">{messages.map(m=><div key={m.id} className={m.role==="user"?"chatRow user":"chatRow panda"}>{m.role==="panda"&&<div className={`miniPanda mood-${pandaMood}`}><img src="/panda-reference.png" alt="Panda"/></div>}<div className="chatBubble">{m.text}<small>{new Date(m.time).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</small></div></div>)}{typing&&<div className="chatRow panda"><div className={`miniPanda mood-${pandaMood}`}><img src="/panda-reference.png" alt="Panda"/></div><div className="typingBubble"><i/><i/><i/></div></div>}<div ref={bottom}/></div><div className="coachSuggestions">{["Make me a balanced diet plan","Show low-calorie snacks","Show high-calorie desserts","List food calories and protein"].map(x=><button key={x} type="button" onClick={()=>send(x)}>{x}</button>)}</div><form className="coachComposer" onSubmit={e=>{e.preventDefault();send()}}><input value={text} onChange={e=>setText(e.target.value)} placeholder="Ask Panda something..."/><button className="primaryButton" type="submit" disabled={!text.trim()}><Icon name="arrow"/>Ask Panda</button></form><small className="coachFootnote">Peaceful Panda ambience is playing while this chat is open. It stops when you leave this page. Food lists use the app’s saved nutrition database; photo recognition needs a configured secure AI service.</small></section></div>}
function History({food,activity,notes}:{food:FoodLog[];activity:ActivityEntry[];notes:Note[]}){
 const dates=Array.from(new Set([...food.map(x=>x.date),...activity.map(x=>x.date),...notes.map(x=>x.date)])).sort().reverse();
 return <div className="page"><Heading e="HISTORY" t="Your saved days" s="See food energy, activity expenditure and notes together for each day."/>
 {dates.length?dates.map(d=>{
   const foods=food.filter(x=>x.date===d), acts=activity.filter(x=>x.date===d), ns=notes.filter(x=>x.date===d);
   const gained=foods.reduce((s,x)=>s+x.totalCalories,0), burned=acts.reduce((s,x)=>s+x.caloriesBurned,0);
   return <section className="historyDay" key={d}>
     <div className="historyDate">{new Date(d+"T00:00:00").toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}</div>
     <div className="historyTotals"><div><span>Food energy</span><strong>{gained} kcal</strong><small>logged</small></div><div><span>Activity burn</span><strong>{burned} kcal</strong><small>estimated</small></div><div><span>Net record</span><strong>{gained-burned} kcal</strong><small>food minus activity</small></div></div>
     {foods.map(x=><div className="historyRow" key={x.logId}><img src={x.image} alt=""/><span>{x.name} · {x.quantity} × {x.serving}</span><b>+{x.totalCalories} kcal</b></div>)}
     {acts.map(x=><div className="historyRow activityHistoryRow" key={x.id}><img src={x.image} alt=""/><span>{x.name} · {x.minutes} min</span><b>−{x.caloriesBurned} kcal</b></div>)}
     {ns.map(x=><p className="historyNote" key={x.id}>{x.text}</p>)}
   </section>
 }):<Empty t="No history yet" d="Your saved entries will appear here."/>}</div>
}
function Profile({profile,setProfile,reminders,setReminders,sound,setSound,noteText,setNoteText,notes,setNotes,saveWeight}:{profile:Profile;setProfile:React.Dispatch<React.SetStateAction<Profile>>;reminders:Reminder[];setReminders:React.Dispatch<React.SetStateAction<Reminder[]>>;sound:boolean;setSound:React.Dispatch<React.SetStateAction<boolean>>;noteText:string;setNoteText:React.Dispatch<React.SetStateAction<string>>;notes:Note[];setNotes:React.Dispatch<React.SetStateAction<Note[]>>;saveWeight:(n:number)=>void}){const update=(k:keyof Profile,v:string)=>setProfile(p=>({...p,[k]:k==="activity"?"moderate":v}));const [saved,setSaved]=useState(false);function save(){if(+profile.weight>0)saveWeight(+profile.weight);setProfile(p=>({...p,setupLocked:true}));setSaved(true);beep(sound);window.setTimeout(()=>setSaved(false),1400);}return <div className="page"><Heading e="PROFILE" t="Your saved profile" s="Name, sex and goal are locked after one-time setup. Other details remain editable."/><section className="formCard premiumEntrance"><div className="lockedGrid"><Locked label="Name" value={profile.name}/><Locked label="Sex" value={profile.sex||"Not set"}/><Locked label="Goal" value={GOALS.find(g=>g[0]===profile.goal)?.[1]||profile.goal}/></div><div className="formGrid"><PremiumField label="Age" value={profile.age} onChange={v=>update("age",v)} type="number"/><PremiumField label="Height" value={profile.height} onChange={v=>update("height",v)} placeholder="cm" type="number"/><PremiumField label="Weight" value={profile.weight} onChange={v=>update("weight",v)} placeholder="kg" type="number"/><div className="premiumField"><label>Activity level</label><div className="lockedField premiumLocked"><span>Daily activity setting</span><strong>Moderate</strong><Icon name="lock" size={15}/></div></div><PremiumField label="Target weight" value={profile.targetWeight} onChange={v=>update("targetWeight",v)} placeholder="Optional" type="number"/><div className="premiumField calendarField"><label>Target date</label><PremiumCalendar value={profile.targetDate} onChange={v=>update("targetDate",v)}/></div></div><button className="primaryButton" type="button" onClick={save}>{saved?"Saved":"Save profile changes"}<Icon name={saved?"check":"arrow"}/></button></section><section className="formCard"><Heading e="NOTES" t="Daily notes"/><textarea value={noteText} onChange={e=>setNoteText(e.target.value)} placeholder="How did today feel?"/><button className="secondaryButton" type="button" onClick={()=>{if(noteText.trim())setNotes(n=>[{id:crypto.randomUUID(),date:today,text:noteText.trim()},...n]);setNoteText("");beep(sound);}}>Save note</button></section><section className="formCard"><Heading e="REMINDERS" t="Your reminders"/>{reminders.map(r=><div className="reminderRow" key={r.id}><Icon name="bell"/><span>{r.type==="water"?"Water":r.type==="food"?"Food":"Activity"}</span><input type="time" value={r.time} onChange={e=>setReminders(a=>a.map(x=>x.id===r.id?{...x,time:e.target.value}:x))}/><button type="button" className={r.enabled?"toggle on":"toggle"} onClick={()=>setReminders(a=>a.map(x=>x.id===r.id?{...x,enabled:!x.enabled}:x))}>{r.enabled?"On":"Off"}</button></div>)}<div className="reminderRow"><Icon name="sound"/><span>Touch sounds</span><button type="button" className={sound?"toggle on":"toggle"} onClick={()=>setSound(!sound)}>{sound?"On":"Off"}</button></div></section></div>}
function Locked({label,value}:{label:string;value:string}){return <div className="lockedField"><span>{label}</span><strong>{value}</strong><Icon name="lock" size={15}/></div>}
function PremiumField({label,value,onChange,placeholder,type="text"}:{label:string;value:string;onChange:(v:string)=>void;placeholder?:string;type?:string}){return <div className="premiumField"><label>{label}</label><div className="inputShell"><input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/><span className="inputGlow"/></div></div>}
function PremiumCalendar({value,onChange}:{value:string;onChange:(v:string)=>void}){const selected=value?new Date(value+"T00:00:00"):new Date();const [month,setMonth]=useState(selected.getMonth());const [year,setYear]=useState(selected.getFullYear());const monthName=new Intl.DateTimeFormat("en-US",{month:"long"}).format(new Date(year,month,1));const first=new Date(year,month,1).getDay();const count=new Date(year,month+1,0).getDate();const cells:Array<number|null>=[...Array.from({length:first},()=>null),...Array.from({length:count},(_,i)=>i+1)];function change(d:number){const n=new Date(year,month+d,1);setMonth(n.getMonth());setYear(n.getFullYear());}function choose(day:number){onChange(`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`);}return <div className="premiumCalendar"><div className="calendarTop"><button type="button" onClick={()=>change(-1)}>‹</button><div><strong>{monthName}</strong><span>{year}</span></div><button type="button" onClick={()=>change(1)}>›</button></div><div className="calendarWeek">{["S","M","T","W","T","F","S"].map((x,i)=><span key={x+i}>{x}</span>)}</div><div className="calendarGrid">{cells.map((day,i)=>day===null?<span key={"e"+i}/>:<button type="button" key={day} className={`calendarDay ${new Date().getFullYear()===year&&new Date().getMonth()===month&&new Date().getDate()===day?"today":""} ${value&&selected.getFullYear()===year&&selected.getMonth()===month&&selected.getDate()===day?"selected":""}`} onClick={()=>choose(day)}>{day}</button>)}</div><div className="calendarFooter"><Icon name="calendar" size={16}/><span>{value?new Date(value+"T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"Choose a target date"}</span></div></div>}
function PandaCharacter({mood="normal"}:{mood?:"normal"|"happy"|"angry"}){return <div className={`pandaCharacter mood-${mood}`} aria-label="Panda coach reference illustration"><img src="/panda-reference.png" alt="Panda coach with green headband, whistle and notebook"/><span className="pandaMoodBadge" aria-hidden="true">{mood==="angry"?"Cute angry mode":mood==="happy"?"Happy Panda":""}</span></div>}
function Heading({e,t,s}:{e:string;t:string;s?:string}){return <div className="sectionHeading mainHeading"><span className="eyebrow">{e}</span><h1>{t}</h1>{s&&<p>{s}</p>}</div>}
function Empty({t,d}:{t:string;d:string}){return <div className="emptyState"><Icon name="spark" size={24}/><strong>{t}</strong><span>{d}</span></div>}
function Modal({children,close}:{children:React.ReactNode;close:()=>void}){return <div className="modalBackdrop" onMouseDown={close}><div className="modalCard" onMouseDown={e=>e.stopPropagation()}><button className="modalClose" onClick={close}><Icon name="close"/></button>{children}</div></div>}
export default App;
