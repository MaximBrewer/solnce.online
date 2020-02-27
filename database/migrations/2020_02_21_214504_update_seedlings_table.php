<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateSeedlingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('seedlings', function (Blueprint $table) {
            $table->integer('min_3')->default(5);
            $table->integer('max_3')->default(10);
            $table->integer('min_4')->default(10);
            $table->integer('max_4')->default(20);
            $table->integer('min_5')->default(20);
            $table->integer('max_5')->default(50);
            $table->integer('min_6')->default(50);
            $table->integer('max_6')->default(100);
            $table->integer('min_7')->default(80);
            $table->integer('max_7')->default(150);
            $table->integer('min_8')->default(90);
            $table->integer('max_8')->default(200);
            $table->integer('min_9')->default(100);
            $table->integer('max_9')->default(300);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('seedlings', function (Blueprint $table) {
            $table->dropColumn('min_3');
            $table->dropColumn('max_3');
            $table->dropColumn('min_4');
            $table->dropColumn('max_4');
            $table->dropColumn('min_5');
            $table->dropColumn('max_5');
            $table->dropColumn('min_6');
            $table->dropColumn('max_6');
            $table->dropColumn('min_7');
            $table->dropColumn('max_7');
            $table->dropColumn('min_8');
            $table->dropColumn('max_8');
            $table->dropColumn('min_9');
            $table->dropColumn('max_9');
        });
    }
}
