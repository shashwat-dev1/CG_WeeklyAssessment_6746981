import { test, expect } from "@playwright/test";
import testData from "./testData/testData.json";

let token: string;
let bookingId: number;

test.describe("Auth - CreateToken", () => {
  test("should return a valid token with correct credentials", async ({ request }) => {
    const response = await request.post("/auth", {
      data: {
        username: testData.auth.username,
        password: testData.auth.password,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty("token");
    expect(typeof body.token).toBe("string");
    expect(body.token.length).toBeGreaterThan(0);

    token = body.token;
  });

  test("should return bad credentials message with wrong password", async ({ request }) => {
    const response = await request.post("/auth", {
      data: {
        username: testData.auth.username,
        password: "wrongpassword",
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty("reason");
    expect(body.reason).toBe("Bad credentials");
  });
});

test.describe("Booking - GetBookingIds", () => {
  test("should return all booking IDs", async ({ request }) => {
    const response = await request.get("/booking");

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    body.forEach((item: { bookingid: number }) => {
      expect(item).toHaveProperty("bookingid");
      expect(typeof item.bookingid).toBe("number");
    });
  });

  test("should filter booking IDs by firstname and lastname", async ({ request }) => {
    const response = await request.get("/booking", {
      params: {
        firstname: testData.filterByName.firstname,
        lastname: testData.filterByName.lastname,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test("should filter booking IDs by checkin date", async ({ request }) => {
    const response = await request.get("/booking", {
      params: {
        checkin: "2024-01-01",
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });
});

test.describe("Booking - GetBooking", () => {
  test("should return booking details for a valid ID", async ({ request }) => {
    const listResponse = await request.get("/booking");
    const list = await listResponse.json();
    const firstId = list[0].bookingid;

    const response = await request.get(`/booking/${firstId}`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty("firstname");
    expect(body).toHaveProperty("lastname");
    expect(body).toHaveProperty("totalprice");
    expect(body).toHaveProperty("depositpaid");
    expect(body).toHaveProperty("bookingdates");
    expect(body.bookingdates).toHaveProperty("checkin");
    expect(body.bookingdates).toHaveProperty("checkout");
    expect(typeof body.firstname).toBe("string");
    expect(typeof body.totalprice).toBe("number");
    expect(typeof body.depositpaid).toBe("boolean");
  });

  test("should return 404 for a non-existent booking ID", async ({ request }) => {
    const response = await request.get("/booking/9999999");

    expect(response.status()).toBe(404);
  });

  test("should return booking as JSON when Accept header is application/json", async ({ request }) => {
    const listResponse = await request.get("/booking");
    const list = await listResponse.json();
    const firstId = list[0].bookingid;

    const response = await request.get(`/booking/${firstId}`, {
      headers: {
        Accept: "application/json",
      },
    });

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");
  });
});

test.describe("Booking - CreateBooking", () => {
  test("should create a new booking and return bookingid with booking object", async ({ request }) => {
    const response = await request.post("/booking", {
      data: testData.createBooking,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty("bookingid");
    expect(typeof body.bookingid).toBe("number");
    expect(body).toHaveProperty("booking");
    expect(body.booking.firstname).toBe(testData.createBooking.firstname);
    expect(body.booking.lastname).toBe(testData.createBooking.lastname);
    expect(body.booking.totalprice).toBe(testData.createBooking.totalprice);
    expect(body.booking.depositpaid).toBe(testData.createBooking.depositpaid);
    expect(body.booking.bookingdates.checkin).toBe(testData.createBooking.bookingdates.checkin);
    expect(body.booking.bookingdates.checkout).toBe(testData.createBooking.bookingdates.checkout);
    expect(body.booking.additionalneeds).toBe(testData.createBooking.additionalneeds);

    bookingId = body.bookingid;
  });

  test("should create a booking without additionalneeds field", async ({ request }) => {
    const { additionalneeds, ...bookingWithoutNeeds } = testData.createBooking;

    const response = await request.post("/booking", {
      data: bookingWithoutNeeds,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty("bookingid");
    expect(body.booking.firstname).toBe(testData.createBooking.firstname);
  });

  test("should persist the created booking and allow retrieval", async ({ request }) => {
    const createResponse = await request.post("/booking", {
      data: testData.createBooking,
    });

    const createBody = await createResponse.json();
    const newBookingId = createBody.bookingid;

    const getResponse = await request.get(`/booking/${newBookingId}`);
    expect(getResponse.status()).toBe(200);

    const getBody = await getResponse.json();
    expect(getBody.firstname).toBe(testData.createBooking.firstname);
    expect(getBody.lastname).toBe(testData.createBooking.lastname);
  });
});

test.describe("Booking - UpdateBooking", () => {
  test.beforeAll(async ({ request }) => {
    const authResponse = await request.post("/auth", {
      data: {
        username: testData.auth.username,
        password: testData.auth.password,
      },
    });
    const authBody = await authResponse.json();
    token = authBody.token;

    const createResponse = await request.post("/booking", {
      data: testData.createBooking,
    });
    const createBody = await createResponse.json();
    bookingId = createBody.bookingid;
  });

  test("should fully update a booking using cookie token", async ({ request }) => {
    const response = await request.put(`/booking/${bookingId}`, {
      headers: {
        Cookie: `token=${token}`,
      },
      data: testData.updateBooking,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.firstname).toBe(testData.updateBooking.firstname);
    expect(body.lastname).toBe(testData.updateBooking.lastname);
    expect(body.totalprice).toBe(testData.updateBooking.totalprice);
    expect(body.depositpaid).toBe(testData.updateBooking.depositpaid);
    expect(body.bookingdates.checkin).toBe(testData.updateBooking.bookingdates.checkin);
    expect(body.bookingdates.checkout).toBe(testData.updateBooking.bookingdates.checkout);
    expect(body.additionalneeds).toBe(testData.updateBooking.additionalneeds);
  });

  test("should fully update a booking using Basic auth header", async ({ request }) => {
    const response = await request.put(`/booking/${bookingId}`, {
      headers: {
        Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=",
      },
      data: testData.updateBooking,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.firstname).toBe(testData.updateBooking.firstname);
    expect(body.lastname).toBe(testData.updateBooking.lastname);
  });

  test("should return 403 when updating without auth token", async ({ request }) => {
    const response = await request.put(`/booking/${bookingId}`, {
      data: testData.updateBooking,
    });

    expect(response.status()).toBe(403);
  });
});

test.describe("Booking - DeleteBooking", () => {
  test.beforeAll(async ({ request }) => {
    const authResponse = await request.post("/auth", {
      data: {
        username: testData.auth.username,
        password: testData.auth.password,
      },
    });
    const authBody = await authResponse.json();
    token = authBody.token;
  });

  test("should delete a booking using cookie token and confirm deletion", async ({ request }) => {
    const createResponse = await request.post("/booking", {
      data: testData.createBooking,
    });
    const createBody = await createResponse.json();
    const idToDelete = createBody.bookingid;

    const deleteResponse = await request.delete(`/booking/${idToDelete}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });

    expect(deleteResponse.status()).toBe(201);

    const getResponse = await request.get(`/booking/${idToDelete}`);
    expect(getResponse.status()).toBe(404);
  });

  test("should delete a booking using Basic auth header", async ({ request }) => {
    const createResponse = await request.post("/booking", {
      data: testData.createBooking,
    });
    const createBody = await createResponse.json();
    const idToDelete = createBody.bookingid;

    const deleteResponse = await request.delete(`/booking/${idToDelete}`, {
      headers: {
        Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=",
      },
    });

    expect(deleteResponse.status()).toBe(201);
  });

  test("should return 403 when deleting without auth token", async ({ request }) => {
    const createResponse = await request.post("/booking", {
      data: testData.createBooking,
    });
    const createBody = await createResponse.json();
    const idToDelete = createBody.bookingid;

    const deleteResponse = await request.delete(`/booking/${idToDelete}`);

    expect(deleteResponse.status()).toBe(403);
  });
});

// Add this in config.js and also run as npx playwright test --project=api as this url does not have any UI 
  // projects: [
  //   {
  //     name: 'api',
  //     use: {
  //       baseURL: 'https://restful-booker.herokuapp.com',
  //       extraHTTPHeaders: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json',
  //       },
  //     },
  //   },