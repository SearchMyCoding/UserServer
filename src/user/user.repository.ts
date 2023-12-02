import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "src/dto/CreateUser.dto";
import { UpdateUserDto } from "src/dto/UpdateUser.dto";
import { User, UserDocument } from "src/schemas/user.schema";
import { getPropertyOfDifferenceSet } from "src/utils/format";
import { Role } from "./user.type";

@Injectable()
export class UserRepository{
  private offset : number = 1000 * 60 * 60 * 9;
  constructor(
    @InjectModel(User.name)
    private readonly userModel : Model<UserDocument>
  ) {}

  async findOneWithId(id : string) : Promise<User>{
    return await this.userModel.findOne({id : id});
  }

  async findOneWithEmail(email : string) : Promise<User>{
    return await this.userModel.findOne({email:email});
  }

  async updateLastLogIn(id : string){
    await this.userModel.findOneAndUpdate({id : id}, {lastLogin : new Date(((new Date()).getTime() + this.offset))})
  }

  async createOne(createUserDto : CreateUserDto, role : Role, dataId : string) : Promise<void>{
    const user : User = Object.assign({}, createUserDto, {
      role : role,
      dataId : dataId,
      createAt : new Date(((new Date()).getTime() + this.offset))
    });
    await this.userModel.create(user);
  }

  async updateUser(id : string, updateUserDto : UpdateUserDto) : Promise<void>{
    const getUserOption = {
      id : id,
      password : updateUserDto.password
    };
    const updateUserOption = Object.assign(getPropertyOfDifferenceSet(updateUserDto, getUserOption));
    await this.userModel.findOneAndUpdate(
      getUserOption,
      updateUserOption,
      {
        new: false,
        upsert: true
      }
    );
  }
}
