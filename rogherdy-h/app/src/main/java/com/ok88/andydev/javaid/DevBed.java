//5-13-15  JChoy Support classes in separate folder
//	This allows code to be copied into projects asis without refactoring the package name.
//5-15-15  JChoy Use DownloadTask extends AsyncTask to run url.openConnection(); 

package com.ok88.andydev.javaid;

import java.io.*;
import java.io.InputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import android.content.Context;
import android.os.*;
import android.util.*;
import android.net.wifi.*;
import android.net.NetworkInfo;
import android.net.NetworkInfo.*;
import android.content.Context;
import android.os.Bundle;
import android.widget.TextView;
import android.util.TypedValue;
import android.graphics.*;
import java.net.*;
import android.os.AsyncTask;


//
// DevBed
//
public class DevBed extends Object {

	//
	// rpt - repeat the string with separator
	public static String rpt(String s, String sep)
	{
		return s+sep+s;
	}

	//
	// foo - returns any string
	public static String foo()
	{
		return "foo-"+ Environment.getExternalStorageDirectory().getAbsolutePath();
	}

	//
	// foow - write foo string to a specified file.
	public static void foow( String filename )
	{
		foow( filename, Environment.getExternalStorageDirectory() );
	}

	//
	// foow - write foo string to a specified file at a specified path.
	public static void foow( String filename, File filepath )
	{
		foow( filename, filepath, foo() );
	}

	//
	// foow - write given string to a specified file at a specified path.
	public static void foow( String filename, File filepath, String val )
	{
		try {
			File file = new File( filepath, filename );
			FileOutputStream fop = new FileOutputStream( file );
			if (!file.exists()) {
				file.createNewFile();
			}
			fop.write( val.getBytes() );
			fop.flush();
			fop.close();
		} catch (Exception e) {
			Log.w("File write failed.",e);
		}
	}

	//
	// getAssetTextData
	public static String getAssetTextData(Context ctx, String filename)
	{
		try {
			InputStream input = ctx.getAssets().open(filename,1);
			return getStrmTextData( ctx, input );
		} catch (Exception e) {
			return null;
		}
	}

	//
	// getLocalTextData
	public static String getLocalTextData(Context ctx, String filename)
	{
		try {
			File fi = new File( ctx.getExternalFilesDir(null), filename );
			FileInputStream input = new FileInputStream( fi );
			return getStrmTextData( ctx, (InputStream)input );
		} catch (Exception e) {
			return null;
		}
	}

	//
	// getStrmTextData
	public static String getStrmTextData(Context ctx, InputStream input)
	{
		return getStrmTextData( input );
	}

	//
	// getStrmTextData
	public static String getStrmTextData(InputStream input)
	{
		try {
			int size = input.available();

			if (size>0){
				byte[] buffer = new byte[size];
				input.read(buffer);
				input.close();

				String text = new String(buffer);
				return text;
			}
		} catch (IOException e){
			Log.w("File read failed.",e);
		}
		return null;
	}//method

	//
	// getWifiName
	public static String getWifiName(Context context) {
	        WifiManager manager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
	        if (manager.isWifiEnabled()) {
	           WifiInfo wifiInfo = manager.getConnectionInfo();
	           if (wifiInfo != null) {
	              DetailedState state = WifiInfo.getDetailedStateOf(wifiInfo.getSupplicantState());
	              if (state == DetailedState.CONNECTED || state == DetailedState.OBTAINING_IPADDR) {
	                  return wifiInfo.getSSID();
	              }
	           }
	        }
	        return null;
	}//method

	//
	// niceTextView
	public static void niceTextView(TextView tv) {
        	tv.setTextSize(TypedValue.COMPLEX_UNIT_SP, 28);
        	tv.setTextColor(Color.parseColor("#000000"));
	}//method

	//
	// exposeAsset
	public static void exposeAsset(Context context, String filename){
		File xfd = context.getExternalFilesDir(null);
		File xfdf = new File( xfd, filename );
		if (!xfdf.exists()) foow( filename, xfd, getAssetTextData(context,filename) );
	}

	//
	// LootBag
	//
	public static class LootBag extends Object {
		public Bundle mBundle;
		public Context mContext;
		public int mItemCount;
		public String mDownloadUrl;

		public LootBag(Context context){
			mContext = context;
			mBundle = new Bundle();

	                File xfd = context.getExternalFilesDir(null);
	        	mBundle.putCharSequence("$DATAFOLDER", xfd.getAbsolutePath());
	        	mBundle.putCharSequence("$ENVFOLDER", foo());
	        	mBundle.putCharSequence("$WIFINAME",getWifiName(context));
			initTabs( "tabs.txt" );

	        	//exposeAsset(context, "tabs.txt");
	        	//foow( "rogherdy-b13.txt", xfd);	//this works
        		//DevBed.foow( "rogherdy-a13.txt", getDir( "rogherdy", MODE_WORLD_WRITEABLE ) );	//this fails
		}

		//
		// initTabs
		public void initTabs(String filename) {
	        	exposeAsset(mContext, filename);
			//String[] at = getAssetTextData(mContext,filename).split("\n");
			String[] at = getLocalTextData(mContext,filename).split("\n");
			mItemCount = at.length;
			for (int i=0; i<at.length; i++){
				String key = String.format( "item_%d", i+1 );
				mBundle.putCharSequence(key, at[i]);
			}
		}

		//
		// fcnea
		public String fcnea( String s ) {
			if (s.charAt(0) != '@') return s;
			s = s.replace("\r","");
	                File xfd = mContext.getExternalFilesDir(null);
			switch (s.substring(1)) {
				case "$DATAFOLDER" : return xfd.getAbsolutePath();
				case "$ENVFOLDER" : return foo();
				case "$WIFINAME" : return getWifiName(mContext);
			}
			try {
				return fcnup(s);
			} catch (Exception e) {
				return "Load failed: "+s;
			}
		}

		//
		// fcnup
		public String fcnup( String s )
		throws Exception
		{
			if (s.length()<9) return s;
			String busyUrl = (String) mBundle.getCharSequence("downloadUrl");

			switch (s.substring(0,9)) {
			    case "@/http://":
			    case "@/https:/":
				String s2= s.substring(2);
				String uc= (String)mBundle.getCharSequence(s2);
				if (uc != null){
				    return uc;
				} if (busyUrl == null) {
				    new DownloadTask(this).execute(s2);
				} else if (s2.equals(busyUrl)) {
				    String res= (String)mBundle.getCharSequence("onPostExecute");
				    mBundle.putCharSequence( s2, res );
				    mBundle.putCharSequence("downloadUrl",null);
				    return res;
				} else {
				}
				return "Loading..."+s;
			}
			return s;
		}

		//
		// getText
		public String getText( int n ) {
			String key = String.format( "item_%d", n );
			String res = (String) mBundle.getCharSequence(key);
			return (res==null) ? key : fcnea(res);
		}
	}//inner static class

	//
	// DownloadTask
	//
	public static class DownloadTask extends AsyncTask<String, Void, String> {

		private LootBag mLoot;

		public DownloadTask(LootBag loot) {
			mLoot = loot;
		}

		@Override
		protected String doInBackground(String... url) {
			mLoot.mBundle.putCharSequence("downloadUrl",url[0]);
			try {
			    URL ucl = new URL(url[0]);
			    //URLConnection uc = ucl.openConnection();
			    return getStrmTextData( ucl.openStream() );
			} catch (Exception e) {
				Log.w("Download failed.",e);
			}
			return "Download failed";
		}

		@Override
		protected void onPostExecute(String res) {
			mLoot.mBundle.putCharSequence("onPostExecute",res);
		}
	}//inner static class

}//class

