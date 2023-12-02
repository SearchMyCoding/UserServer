import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { toConcatObject, getPropertyOfDifferenceSet, IsValidEmail } from 'src/utils/format';
import { UserRepository } from './user.repository';
import { CreateUserDto } from 'src/dto/CreateUser.dto';
import { UpdateUserDto } from 'src/dto/UpdateUser.dto';
import { createHashPassword } from 'src/utils/hash';
import { Key, Role } from './user.type';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository : UserRepository
    ){}

    async updateLastLogIn(id : string) : Promise<void>{
        this.userRepository.updateLastLogIn(id);
    }

    async getUser(id : string) : Promise<User>{
        const User : User = await this.userRepository.findOneWithId(id);
        if(!User)
            throw new NotFoundException(`User does not exist.`);
        return User;
    }

    async getUserId(name : string, email : string) : Promise<string>{
        if(!IsValidEmail(email))
            throw new BadRequestException(`Bad Email Format`);
        const user : User = await this.userRepository.findOneWithEmail(email);
        if(!user || user.name !== name)
            throw new NotFoundException(`User does not exist.`);
        return user.id;
    }

    async changeDefaultPassword(user : User) : Promise<string>{
        const hashedPassword : string = createHashPassword(user.password);
        const updateUser : UpdateUserDto = {
            password : user.password,
            modifyPassword : hashedPassword
        };
        //// user 비번 바꾸기
        try{
            await this.userRepository.updateUser(user.id, updateUser);
        }catch(err){
            throw err;
        }

        return hashedPassword;
    }

    async addUser(createUserDto : CreateUserDto, role : Role = "user") : Promise<void>{
        if(!IsValidEmail(createUserDto.email))
            throw new BadRequestException(`Bad Email Format`);
        
        const {id, email, password, name} = createUserDto;
        
        const [userWithId, userWithEmail] : User[] = await Promise.all([
            this.userRepository.findOneWithId(id),
            this.userRepository.findOneWithEmail(email)
        ]);
        if(userWithId || userWithEmail)
            throw new BadRequestException(`User is exist.`);
        const hashedPassword : string = createHashPassword(password);
        const dataId : string = createHashPassword(id);
        await this.userRepository.createOne({
            id : id,
            email: email,
            password : hashedPassword,
            name: name
        }, role, dataId);
    }

    async updateUser(user : User, updateUserDto : UpdateUserDto, key : Key){
        const updateUser : UpdateUserDto = {
            password : createHashPassword(updateUserDto.password)
        };
        if(key === "id")
            throw new BadRequestException(`You cannot change id.`);
        
        const updateKey = key !== "all" ? "modify" + key[0].toUpperCase() + key.slice(1) : key;
        if(key !== "all")
            if(!updateUserDto[updateKey])
                throw new BadRequestException(`You miss something`);
        if(["password", "all"].includes(key))
            Object.assign(updateUser, {modifyPassword : createHashPassword(updateUserDto.modifyPassword)});
        else{
            let temp = {};
            temp[updateKey] = updateUserDto[updateKey];
            if(key === 'email')
                if(!IsValidEmail(temp[updateKey]))
                    throw new BadRequestException(`Bad Email Format`);
            Object.assign(updateUser, temp);
        }
        const newUpdateUser : UpdateUserDto = updateKey === "all" ? toConcatObject(updateUser, getPropertyOfDifferenceSet<UpdateUserDto>(updateUserDto, updateUser)) : updateUser;

        try{
            await this.userRepository.updateUser(user.id, newUpdateUser);
        }catch(err){
            throw err;
        }
    }

    /**
     * todo : User schema 변경하는 기능 추가
     */
    // async updateUserSchema(){}
}
