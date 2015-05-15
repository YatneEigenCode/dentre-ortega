//5-13-15  JChoy Support classes in separate folder
//	This allows code to be copied into projects asis without refactoring the package name.
//5-14-15  JChoy Incorporate ExternalFilesDir functionality into LootBag.

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
		try {
			File file = new File( filepath, filename );
			FileOutputStream fop = new FileOutputStream( file );
			if (!file.exists()) {
				file.createNewFile();
			}
			fop.write( foo().getBytes() );
			fop.flush();
			fop.close();
		} catch (Exception e) {
			Log.w("File write failed.",e);
		}
	}

	//
	// getAssetTextData
	public static String getAssetTextData(Context ctx, String filename)
	throws IOException
	{
		InputStream input = ctx.getAssets().open(filename,1);
		int size = input.available();

		if (size>0){
			byte[] buffer = new byte[size];
			input.read(buffer);
			input.close();

			String text = new String(buffer);
			return text;
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
	// LootBag
	//
	public static class LootBag extends Object {
		public Bundle mBundle;
		public Context mContext;

		public LootBag(Context context){
			mContext = context;
			mBundle = new Bundle();
	        	mBundle.putCharSequence("item_1","fooGoo");
	        	mBundle.putCharSequence("item_2",getWifiName(context));
	        	
	                File xfd = context.getExternalFilesDir(null);
	        	mBundle.putCharSequence("item_4", xfd.getAbsolutePath());
	        	foow( "rogherdy-b13.txt", getExternalFilesDir(null) );	//this works
        		//DevBed.foow( "rogherdy-a13.txt", getDir( "rogherdy", MODE_WORLD_WRITEABLE ) );	//this fails
		}

		//
		// getText
		//
		public String getText( int n ) {
			String key = String.format( "item_%d", n );
			String res = (String) mBundle.getCharSequence(key);
			return (res==null) ? key : res;
		}
	}//inner static class

}//class

