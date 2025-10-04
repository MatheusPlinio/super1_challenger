import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    // -------- Users --------
    const passwordHash = await bcrypt.hash('123456', 10);

    const users = [];
    users.push(
        await prisma.user.create({
            data: { name: 'Admin User', email: 'admin@example.com', password: passwordHash, role: 'ADMIN' },
        })
    );

    users.push(
        await prisma.user.create({
            data: { name: 'Provider One', email: 'provider1@example.com', password: passwordHash, role: 'PROVIDER' },
        })
    );

    users.push(
        await prisma.user.create({
            data: { name: 'Provider Two', email: 'provider2@example.com', password: passwordHash, role: 'PROVIDER' },
        })
    );

    // Clientes
    for (let i = 1; i <= 2; i++) {
        users.push(
            await prisma.user.create({
                data: {
                    name: faker.person.fullName(),
                    email: `client${i}@example.com`,
                    password: passwordHash,
                    role: 'CLIENT',
                },
            })
        );
    }

    // -------- Service Types --------
    const serviceTypes = [];
    const usedNames = new Set<string>();

    for (let i = 0; i < 10; i++) {
        let name;
        do {
            name = faker.commerce.department() + ' ' + faker.number.int({ min: 1, max: 1000 });
        } while (usedNames.has(name));
        usedNames.add(name);

        serviceTypes.push(
            await prisma.serviceType.create({
                data: { name },
            })
        );
    }

    // -------- Services --------
    const services = [];
    for (const type of serviceTypes) {
        for (let i = 0; i < 10; i++) {
            const provider = users.filter(u => u.role === 'PROVIDER')[Math.floor(Math.random() * 2)];
            services.push(
                await prisma.service.create({
                    data: {
                        name: faker.commerce.productName(),
                        description: faker.commerce.productDescription(),
                        photos: [faker.image.urlPicsumPhotos(), faker.image.urlPicsumPhotos()],
                        providerId: provider.id,
                        serviceTypeId: type.id,
                    },
                })
            );
        }
    }

    // -------- Variations --------
    const variations = [];
    for (const service of services) {
        for (let i = 0; i < 10; i++) {
            variations.push(
                await prisma.variation.create({
                    data: {
                        name: faker.commerce.productAdjective(),
                        price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
                        duration: faker.number.int({ min: 30, max: 180 }),
                        serviceId: service.id,
                    },
                })
            );
        }
    }

    // -------- Bookings --------
    const clients = users.filter(u => u.role === 'CLIENT');
    for (let i = 0; i < 10; i++) {
        await prisma.booking.create({
            data: {
                clientId: clients[Math.floor(Math.random() * clients.length)].id,
                variationId: variations[Math.floor(Math.random() * variations.length)].id,
                date: faker.date.future(),
                status: faker.helpers.arrayElement(['PENDING', 'CONFIRMED', 'CANCELED']),
            },
        });
    }

    // -------- Carts --------
    const carts = [];
    for (let i = 0; i < clients.length; i++) {
        carts.push(await prisma.cart.create({ data: { userId: clients[i].id } }));
    }

    // -------- Cart Items --------
    for (const cart of carts) {
        for (let i = 0; i < 10; i++) {
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    variationId: variations[Math.floor(Math.random() * variations.length)].id,
                    quantity: faker.number.int({ min: 1, max: 5 }),
                },
            });
        }
    }

    console.log('Seed grande concluída!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
