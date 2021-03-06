import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from "@nestjs/common"; // 編集！
import { ItemService } from "./item.service"; // 追記！
import { Item } from "../entities/item.entity"; // 追記！
import { CreateItemDTO, DeleteItemDTO, UpdateItemDTO } from "./item.dto"; // 追記！
import { InsertResult, UpdateResult, DeleteResult } from "typeorm"; // 追記！

@Controller("item")
export class ItemController {
  // サービスの呼び出し
  constructor(private readonly service: ItemService) {}

  // `item`のURIへのGETメソッドでデータ全件取得．サービスの`findAll()`関数を実行．
  @Get()
  async getItemList(): Promise<Item[]> {
    return await this.service.findAll();
  }

  // `item`のURIへのPOSTメソッドでデータ新規登録．
  @Post()
  async addItem(@Body() item: CreateItemDTO): Promise<InsertResult> {
    return await this.service.create(item);
  }

  // `item/id番号`のURIへのGETメソッドでid指定で1件データ取得．
  @Get(":id")
  async getItem(@Param("id") id: string): Promise<Item> {
    return await this.service.find(Number(id));
  }

  @Put(":id/update")
  async update(
    @Param("id") id: string,
    @Body() itemData: UpdateItemDTO,
  ): Promise<UpdateResult > {
    const newData = !itemData.isDone
      ? itemData
      : {
        ...itemData,
        ...{ isDone: itemData.isDone.toLowerCase() === "true" },
      };
    return await this.service.update(Number(id), newData);
  }

  @Delete(":id/delete")
  async delete(@Param("id") id: string): Promise<DeleteResult> {
    return await this.service.delete(Number(id));
  }

  @Post(":id/delete")
  async deleteItem(
    @Param("id") id: string,
    @Body() deleteItem: DeleteItemDTO,
  ){
    const item = await this.service.find(Number(id));

    if(!item){
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Missing item(id: ${id}).`,
        },
        404,
      )
    }
    try {
      await this.service.deleteByPassword(
        Number(id),
        deleteItem.deletePassword,
      );
    } catch (e){
      if(e.message === "Incorrect password"){
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: "Incorrect password",
          },
          403,
        );
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Internal server error."
        },
        500,
      );
    }
    return;
  }
}
