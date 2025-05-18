class BannerClass {
  constructor(banner_name, banner_image, description) {
    this.banner_name = banner_name;
    this.banner_image = banner_image;
    this.description = description;
  }
}

class ServiceClass {
  constructor(service_code, service_name, service_icon, service_tariff) {
    this.service_code = service_code;
    this.service_name = service_name;
    this.service_icon = service_icon;
    this.service_tariff = service_tariff;
  }
}

module.exports = { BannerClass, ServiceClass };
