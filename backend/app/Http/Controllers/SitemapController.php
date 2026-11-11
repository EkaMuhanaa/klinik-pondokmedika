<?php

namespace App\Http\Controllers;

use App\Models\Article;

class SitemapController extends Controller
{
    public function __invoke()
    {
        $base = config('clinic.frontend_url');
        $urls = [];

        foreach (config('clinic.static_paths') as $path => $priority) {
            $urls[] = ['loc' => $base.($path === '/' ? '/' : $path), 'priority' => $priority, 'lastmod' => null];
        }

        Article::where('is_published', true)->latest('updated_at')
            ->get(['slug', 'updated_at'])
            ->each(function ($a) use (&$urls, $base) {
                $urls[] = ['loc' => $base.'/artikel/'.$a->slug, 'priority' => 0.6, 'lastmod' => $a->updated_at?->toAtomString()];
            });

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n".'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";
        foreach ($urls as $u) {
            $xml .= '  <url><loc>'.e($u['loc']).'</loc>'
                .($u['lastmod'] ? '<lastmod>'.$u['lastmod'].'</lastmod>' : '')
                .'<priority>'.number_format($u['priority'], 1).'</priority></url>'."\n";
        }
        $xml .= '</urlset>'."\n";

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }
}
