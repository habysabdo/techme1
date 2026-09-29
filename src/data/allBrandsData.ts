export interface CarBrandCategory {
  category: string;
  brands: string[];
}

export const ALL_CAR_BRAND_CATEGORIES: CarBrandCategory[] = [
  {
    category: 'Domestic (US)',
    brands: ['Ford', 'Lincoln', 'Chevrolet', 'GMC', 'Cadillac', 'Buick', 'Chrysler', 'Dodge', 'Jeep', 'Ram', 'Tesla'],
  },
  {
    category: 'Asian Imports',
    brands: ['Toyota', 'Lexus', 'Honda', 'Acura', 'Nissan', 'Infiniti', 'Subaru', 'Mazda', 'Hyundai', 'Kia', 'Genesis', 'Mitsubishi'],
  },
  {
    category: 'European Precision',
    brands: ['BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Porsche', 'Volvo', 'Land Rover', 'Jaguar', 'MINI', 'Alfa Romeo'],
  },
  {
    category: 'Commercial Heavy & Diesel',
    brands: ['Ford Super Duty', 'Duramax / Allison', 'Cummins / Ram HD', 'Freightliner', 'Isuzu Commercial', 'Hino Trucks'],
  },
  {
    category: 'EV & Exotic',
    brands: ['Rivian', 'Lucid', 'Polestar', 'Maserati', 'Ferrari', 'McLaren', 'Aston Martin'],
  },
];

export const ALL_CAR_BRANDS: string[] = Array.from(
  new Set(ALL_CAR_BRAND_CATEGORIES.flatMap((c) => c.brands))
).sort();
