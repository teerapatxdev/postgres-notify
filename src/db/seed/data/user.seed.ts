import { User } from 'src/db/entities/User.entity';
import { DataSource } from 'typeorm';

export async function seedUsers(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  await userRepository.delete({});
  await userRepository.insert([
    {
      firstname: 'Tony',
      lastname: 'Stark',
      email: 'tonay.stark@gmail.com',
      phoneNumber: '0911111111',
      remarks: 'mockup',
      rewardPoint: 0,
    },
    {
      firstname: 'Thor',
      lastname: 'Odinson',
      email: 'thor.odinson@gmail.com',
      phoneNumber: '0922222222',
      remarks: 'mockup',
      rewardPoint: 0,
    },
    {
      firstname: 'Anya',
      lastname: 'Forger',
      email: 'anya.forger@gmail.com',
      phoneNumber: '0933333333',
      remarks: 'mockup',
      rewardPoint: 0,
    },
  ]);
}
