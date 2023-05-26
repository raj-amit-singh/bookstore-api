import { Body, Controller, Get, HttpException, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { BookService } from '../book/book.service';
import { CartItemDto } from './dto/cart-item.dto';
import { CartItem } from './types/user.types';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@ApiTags('Users')
export class UserController {
	constructor(private userService: UserService, private bookService: BookService) {}


    @Get()
    @UseGuards(AuthGuard())
	public async me(@Req() req) {
		const user = req.user
		if (!user) return null;
		const res = await this.userService.findById(user._id)
		return res;
	}

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
