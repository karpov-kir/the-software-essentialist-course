import express, { Request, Response } from 'express';
import { PrismaClient, User, Prisma } from '@prisma/client';

class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createUser(user: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({
      data: user,
    });
  }

  async updateUser(id: number, user: Prisma.UserUpdateInput): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: user,
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }
}

const userService = new UserService();
const app = express();

app.use(express.json());

app.post('/users', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email } = req.body;

    // Validate request body
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'First name, last name, and email are required' });
    }

    const user = await userService.createUser({
      firstName,
      lastName,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;

  try {
    const user = await userService.updateUser(Number(id), {
      firstName,
      lastName,
      email,
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/users/:email', async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
