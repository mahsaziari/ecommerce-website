const express = require('express')
const {
    client,
    createTables,
    createUser,
    createSkill,
    fetchUsers,
    fetchSkills,
    createUserSkill
} = require('./db')

const app = express()
const port = process.env.PORT || 3000

const seedData = async () => {
    await createTables()
    await Promise.all([
        createUser({ username: "Katherine", password: 'fhkrhrjfh' }),
        createUser({ username: "Brooke", password: 'ytoegfyhfk' }),
        createUser({ username: "Natalie", password: 'sbfhglfrhg' }),
        createSkill("Coding"),
        createSkill("Customer Service"),
        createSkill("Sales"),
        createSkill("Communication"),
    ])
    const users = await fetchUsers()
    const skills = await fetchSkills()
    const katherine = users[0]
    const brooke = users[1]
    const natalie = users[2]
    await Promise.all([
        createUserSkill({ userId: katherine.id, skillId: skills[0].id }),
        createUserSkill({ userId: katherine.id, skillId: skills[1].id }),
        createUserSkill({ userId: natalie.id, skillId: skills[0].id }),
        createUserSkill({ userId: natalie.id, skillId: skills[1].id }),
        createUserSkill({ userId: brooke.id, skillId: skills[2].id }),
        createUserSkill({ userId: natalie.id, skillId: skills[3].id }),
        createUserSkill({ userId: brooke.id, skillId: skills[2].id }),
        createUserSkill({ userId: brooke.id, skillId: skills[3].id }),
    ])
}

app.use(express.json())
app.use('/api/users', require('./controllers/users'));
app.use('/api/skills', require('./controllers/skills'));

const init = async () => {
    await client.connect()
    app.listen(port)

}
init();




const Ajv = require("ajv");
const ajv = new Ajv();

const ecommerceSchema = {
  $id: "https://example.com/schemas/ecommerce.json",
  type: "object",
  properties: {
    users: {
      type: "array",
      items: {
        type: "object",
        properties: {
          user_id: { type: "integer" },
          username: { type: "string" },
          password: { type: "string" },
        },
        required: ["user_id", "username", "password"]
      }
    },
    products: {
      type: "array",
      items: {
        type: "object",
        properties: {
          product_id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          category_id: { type: "integer" }
        },
        required: ["product_id", "name", "price"]
      }
    },
    categories: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category_id: { type: "integer" },
          name: { type: "string" }
        },
        required: ["category_id", "name"]
      }
    },
    orders: {
      type: "array",
      items: {
        type: "object",
        properties: {
          order_id: { type: "integer" },
          user_id: { type: "integer" },
          order_date: { type: "string", format: "date-time" },
          total_price: { type: "number" }
        },
        required: ["order_id", "user_id", "order_date", "total_price"]
      }
    },
    order_items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          order_item_id: { type: "integer" },
          order_id: { type: "integer" },
          product_id: { type: "integer" },
          quantity: { type: "integer" },
          price_per_item: { type: "number" }
        },
        required: ["order_item_id", "order_id", "product_id", "quantity", "price_per_item"]
      }
    },
    reviews: {
      type: "array",
      items: {
        type: "object",
        properties: {
          review_id: { type: "integer" },
          user_id: { type: "integer" },
          product_id: { type: "integer" },
          rating: { type: "number" },
          comment: { type: "string" },
          review_date: { type: "string", format: "date-time" }
        },
        required: ["review_id", "user_id", "product_id", "rating", "review_date"]
      }
    }
  },
  required: ["users", "products", "categories", "orders", "order_items", "reviews"]
};

const validate = ajv.compile(ecommerceSchema);

module.exports = validate;
