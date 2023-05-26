import { Body, Controller, HttpException, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { BookService } from '../book/book.service';
import { CartItemDto } from './dto/cart-item.dto';
import { CartItem } from './types/user.types';

@Controller('user')
@ApiTags('Users')
export class UserController {
	constructor(private userService: UserService, private bookService: BookService) {}


    @Post('update-cart-item')
	public async updateAmountCartItem(@Body() cartItem: CartItemDto, @Req() req) {
		const { _id } = cartItem;
		const user = req.user;
		try {
            
			let cart: CartItem[] = [];
			cart = cart.map((item) =>
				item._id == _id ? { ...item, total: cartItem.total } : item,
			);
            
			// if logged in, update cart of user
			if (user) {
				await this.userService.updateCartItem(user._id, cartItem);
			}
			return cart;
		} catch (error) {
			throw new HttpException(error.message, 500);
		}
	}
}
