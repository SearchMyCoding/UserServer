import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from 'src/dto/CreateUser.dto';
import { UpdateUserDto } from 'src/dto/UpdateUser.dto';
import { User } from 'src/schemas/user.schema';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';


describe('UserService', () => {
  let service: UserService;
  let userRepository : UserRepository;
  let mockUser : User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserRepository,
        {
          provide:getModelToken(User.name),
          useFactory: ()=>{}
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(
      UserRepository
    );

    mockUser = {
      id : "test",
      email : 'test1234@test.test',
      name : 'test',
      password : '9f86d081884c7d659a2feaa0c55ad015',
      role : "user",
      dataId : '9f86d081884c7d659a2feaa0c55ad015',
      createAt : new Date()
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUser',()=>{
    const mockId : string = 'test';
    const mockErrorId : string = 'helloworld';

    it('should find a user', async ()=>{
      jest.spyOn(userRepository, "findOneWithId").mockResolvedValue(mockUser);
      
      const result : User = await service.getUser(mockId);
      
      expect(result.id).toEqual(mockId);
    });
  });

  describe('getUserId', ()=>{
    const mockEmail : string = 'test1234@test.test';
    const mockName : string = 'test';
    const mockErrorEmail : string = 'helloworld';
    const mockNotFoundEmail : string = "test@test.test"

    it('should find a userId', async ()=>{
      jest
        .spyOn(userRepository, "findOneWithEmail")
        .mockResolvedValue(mockUser);
      const result : string = await service.getUserId(mockName, mockEmail);
      
      expect(result).toEqual(mockUser.id);
    });

    it("should return a BadRequestException", async () => {
      try{
        await service.getUserId(mockName, mockErrorEmail);
      }catch(err){
        expect(err).toBeInstanceOf(BadRequestException);
      }
    });

    it("should return a NotFoundException", async () => {
      jest
        .spyOn(userRepository, "findOneWithEmail")
        .mockResolvedValue(undefined);
      try{
        await service.getUserId(mockName, mockNotFoundEmail);
      }catch(err){
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('changeDefaultPassword', ()=>{
    const mockEmail : string = 'test1234@test.test';
    const mockName : string = 'test';

    const mockUpdateUserWithDefaultPassword : User = {
      id : "test",
      email : 'test1234@test.test',
      name : 'test',
      password : '640ab86890ccc2b38d0fda471e9defa59967a22d594a9e21df77212302bb8518ec6eaa3e559a7d6e1ce7d7f33936b80d888123ea48a1931ac61830d5d854616b',
      role : "user",
      dataId : '9f86d081884c7d659a2feaa0c55ad015',
      createAt : mockUser.createAt
    };

    it("should update user password to default password", async()=>{
      jest.spyOn(userRepository, "findOneWithEmail").mockResolvedValue(mockUser);
      const BeforeFoundUser : string = await service.getUserId(mockName,mockEmail);
      jest.spyOn(userRepository, "findOneWithId").mockResolvedValue(mockUser);
      const BeforeUpdate : User = await service.getUser(BeforeFoundUser);

      jest.spyOn(userRepository, "updateUser").mockResolvedValue();
      const result = await service.changeDefaultPassword(BeforeUpdate);
      
      jest.spyOn(userRepository, "findOneWithEmail").mockResolvedValue(mockUpdateUserWithDefaultPassword);
      const AfterFoundUser : string = await service.getUserId(mockName,mockEmail);
      jest.spyOn(userRepository, "findOneWithId").mockResolvedValue(mockUpdateUserWithDefaultPassword);
      const AfterUpdate : User = await service.getUser(AfterFoundUser);

      expect(BeforeUpdate.id).toEqual(AfterUpdate.id);
      expect(BeforeUpdate.name).toEqual(AfterUpdate.name);
    })
  });

  describe("SignUp", ()=>{
    const mockEmail : string = 'test1234@test.test';
    const mockName : string = 'test';
    const mockId : string = "test";
    const mockcreateUserDto : CreateUserDto = {
      name : mockName,
      email: mockEmail,
      id : mockId,
      password : "test"
    };

    it("should create a user", async () => {
      jest.spyOn(userRepository, "findOneWithId").mockResolvedValue(undefined);
      jest.spyOn(userRepository, "findOneWithEmail").mockResolvedValue(undefined);
      jest.spyOn(userRepository, "createOne").mockResolvedValue();
      
      const result = await service.addUser(mockcreateUserDto);

      jest.spyOn(userRepository, "findOneWithId").mockResolvedValue(mockUser);
      jest.spyOn(userRepository, "findOneWithEmail").mockResolvedValue(mockUser);
      const AfterCreate : User = await service.getUser(mockId);

      expect(AfterCreate.id).toEqual(mockcreateUserDto.id);
      expect(AfterCreate.name).toEqual(mockcreateUserDto.name);
    });
  });

  describe("updateUser", ()=>{
    const mockId : string = "test";
    const mockEmail : string = 'test1234@test.test';
    const mockUpdateEmail : string = 'test1234@test.test';
    const mockName : string = "test";
    const mockPassword : string = 'test';
    const mockUpdatePassword : string = 'test';
    const mockUpdatePasswordUserDto : UpdateUserDto = {
      password : mockPassword,
      modifyPassword : mockUpdatePassword
    };
    const mockUpdateEmailUserDto : UpdateUserDto = {
      password : mockPassword,
      modifyEmail : mockUpdateEmail
    };
    const mockUpdateUser : User = {
      id : mockId,
      email : mockEmail,
      name : mockName,
      password : '9f86d081884c7d659a2feaa0c55ad015',
      role : "user",
      dataId : '9f86d081884c7d659a2feaa0c55ad015',
      createAt : mockUser.createAt
    };
    it("should update a password", async ()=>{
      jest.spyOn(userRepository, "findOneWithId").mockResolvedValue(mockUser);
      const BeforeUpdate : User = await service.getUser(mockId);

      jest.spyOn(userRepository, "updateUser").mockResolvedValue();
      const result = await service.updateUser(BeforeUpdate, mockUpdatePasswordUserDto, "password");

      jest.spyOn(userRepository, "findOneWithId").mockResolvedValue(mockUpdateUser);
      const AfterUpdate : User = await service.getUser(mockId);

      expect(BeforeUpdate.id).toEqual(AfterUpdate.id);
      expect(BeforeUpdate.name).toEqual(AfterUpdate.name);
    })

    it("should update a email", async ()=>{
      jest.spyOn(userRepository, "findOneWithId").mockResolvedValue(mockUser);
      const BeforeUpdate : User = await service.getUser(mockId);

      jest.spyOn(userRepository, "updateUser").mockResolvedValue();
      const result = await service.updateUser(BeforeUpdate, mockUpdateEmailUserDto, "email");

      jest.spyOn(userRepository, "findOneWithId").mockResolvedValue(mockUpdateUser);
      const AfterUpdate : User = await service.getUser(mockId);

      expect(BeforeUpdate.id).toEqual(AfterUpdate.id);
      expect(BeforeUpdate.name).toEqual(AfterUpdate.name);
    })
  })

});
