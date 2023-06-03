import t from "tap";
import Fastify from "fastify";
import App from "../app.js";

//login
t.test("should return 200 status code and token", async (t) => {
  const fastify = Fastify();

  await fastify.register(App);

  const response = await fastify.inject({
    method: "POST",
    path: "/login",
    payload: {
      username: "user1",
      password: "user123",
    },
  });

  t.equal(response.statusCode, 200);
  t.ok(response.json().token && response.json().token.length > 0);
});

//logout
t.test("should return 200 status code and token", async (t) => {
  const fastify = Fastify();

  await fastify.register(App);

  const response = await fastify.inject({
    method: "GET",
    path: "/logout",
  });

  t.equal(response.statusCode, 200);
});

//sigin
t.test(
  "if the user is not registered should return 200 status code and messagge",
  async (t) => {
    const fastify = Fastify();

    await fastify.register(App);

    const response = await fastify.inject({
      method: "POST",
      path: "/sigIn",
      payload: {
        name: "Admin 1",
        username: "admin123",
        surname: "chano",
        role: "admin",
        password: "admin123",
        confirmPassword: "admin123",
        email: "admin12@example.com",
      },
    });

    t.equal(response.statusCode, 200);
    t.ok(response.json().message.length > 0);
  }
);

t.test(
  "if password and confirmPassword not equal should return 400 status code and messagge",
  async (t) => {
    const fastify = Fastify();

    await fastify.register(App);

    const response = await fastify.inject({
      method: "POST",
      path: "/sigIn",
      payload: {
        name: "Admin 1",
        username: "admin123",
        surname: "chano",
        role: "admin",
        password: "admin123",
        confirmPassword: "admin123333",
        email: "admin12@example.com",
      },
    });

    t.equal(response.statusCode, 400);
    t.ok(response.json().message.length > 0);
  }
);

//address

t.test("address", async (t) => {
  const fastify = Fastify();

  await fastify.register(App);
  const response = await fastify.inject({
    method: "POST",
    path: "/address",
    payload: {
      address: "Via fiore 11",
      code: "40127",
      city: "Bologna",
      country: "italy",
      phone: "32865644",
    },
  });
  t.equal(response.statusCode, 200, "User registered successfully");

  // select

  const responseSelect = await fastify.inject({
    method: "GET",
    path: "/address/select",
  });
  t.equal(responseSelect.statusCode, 200);

  // //update--change params
  const respUpdate = await fastify.inject({
    method: "PUT",
    path: "/address/update/15",
    payload: {
      address: "Via fiore 11",
      code: "40127",
      city: "Bologna",
      country: "italy",
      phone: "328655644",
    },
  });
  t.equal(respUpdate.statusCode, 200);

  const respUpdateWithoutParams = await fastify.inject({
    method: "PUT",
    path: "/address/update",
    payload: {
      address: "Via fiore 11",
      code: "40127",
      city: "Bologna",
      country: "italy",
      phone: "328655644",
    },
  });
  t.equal(respUpdateWithoutParams.statusCode, 404);

  //delete--change params
  const responseDel = await fastify.inject({
    method: "DELETE",
    path: "/address/delete/15",
  });
  t.equal(responseDel.statusCode, 200);
});

//shopping
t.test("shopping", async (t) => {
  const fastify = Fastify();

  await fastify.register(App);
  const data = [
    {
      username: "user1",
      product: "3",
      image: "path/immagine1.jpg",
      quantity: 2,
      product_price: 9.99,
    },
    {
      username: "user2",
      product: "2",
      image: "path/immagine2.jpg",
      quantity: 1,
      product_price: 10,
    },
  ];

  const respShopping = await fastify.inject({
    method: "POST",
    path: "/shopping",
    payload: [
      {
        username: "user1",
        product: "3",
        image: "path/immagine1.jpg",
        quantity: 2,
        product_price: 9.99,
      },
      {
        username: "user2",
        product: "2",
        image: "path/immagine2.jpg",
        quantity: 1,
        product_price: 10,
      },
    ],
  });
  t.equal(respShopping.statusCode, 200);

  //delete--change params
  const respShoppingDel = await fastify.inject({
    method: "DELETE",
    path: "/shopping/delete/22",
  });

  t.equal(respShoppingDel.statusCode, 200);
});
