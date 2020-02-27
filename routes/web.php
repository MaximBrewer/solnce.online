<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'NfsController@index')->name('nfs');


Route::group(['prefix' => 'admin'], function () {
    Voyager::routes();
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Route::get('/photos/{id}', 'PhotosController@all')->name('photos');
Route::patch('/cart/order', 'CartController@order')->name('cart-order');
Route::get('/cart/getSeedling', 'CartController@getSeedling')->name('cart-getSeedling');
Route::post('/cart/addSeedling', 'CartController@addSeedling')->name('cart-addSeedling');
Route::delete('/cart/removeSeedling/{id}', 'CartController@removeSeedling')->name('cart-removeSeedling');

Route::get('/seedlings', 'SeedlingsController@index')->name('seedlings');
Route::get('/seedlings/calc', 'SeedlingsController@calc')->name('seedlings');
Route::get('/seedlings/{id}', 'SeedlingsController@show')->name('seedlings');


Route::post('/questionnaire', 'QuestionnaireController@store')->name('questionnaire');