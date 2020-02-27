<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Photo;
use App\Album;
use TCG\Voyager\Http\Controllers\ContentTypes\Image;

class FillPhotos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fill:photos';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        //
        // $dir =  storage_path(). '/app/public/albums/2';
        // foreach (glob($dir . "/1/*.jpg") as $k => $filename) {
        //     copy($filename, storage_path(). '/app/public/photos/February2020/' . basename($filename));
        //     Photo::create([
        //         'album_id' => 2,
        //         'photo' => 'photos/February2020/' . basename($filename),
        //         'title' => "Фото" . ($k+1)
        //     ]);
        // }
    }
}
