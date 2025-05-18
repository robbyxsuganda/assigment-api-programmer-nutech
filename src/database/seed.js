const pool = require("../config/db.config");

const fs = require("fs").promises;

async function seeding() {
  try {
    // insert services
    let insertServices = `INSERT INTO services (service_code, service_name, service_icon, service_tariff) VALUES \n`;
    const servicesJson = JSON.parse(
      await fs.readFile("./src/database/data/services.json", "utf-8")
    );

    const servicesMap = servicesJson
      .map((service) => {
        return `('${service.service_code}', '${service.service_name}', '${service.service_icon}', ${service.service_tariff})`;
      })
      .join(", \n");

    insertServices += servicesMap;

    //insert Banners
    let insertBanners = `INSERT INTO banners (banner_name,banner_image,description) VALUES \n`;
    const bannersJson = JSON.parse(
      await fs.readFile("./src/database/data/banners.json", "utf-8")
    );

    const bannersMap = bannersJson
      .map((banner) => {
        return `('${banner.banner_name}', '${banner.banner_image}', '${banner.description}')`;
      })
      .join(", \n");

    insertBanners += bannersMap;

    await pool.query(insertServices);
    console.log("INSERT SERVICES SUCCESS");

    await pool.query(insertBanners);
    console.log("INSERT BANNERS SUCCESS");
  } catch (error) {
    console.log(error);
  }
}

seeding();
